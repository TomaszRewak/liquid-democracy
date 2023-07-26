mod common_data;
mod extensions;
mod middlewares;
mod network_data;

use axum::body::{Bytes, Full};
use axum::extract::{Json as JsonRequest, Path};
use axum::http::{Method, StatusCode};
use axum::response::{Json as JsonResponse, Response};
use axum::Extension;
use axum::{routing::get, routing::post, Router};
use bytes::BytesMut;
use cookie::Cookie;
use extensions::{auth_state::AuthState, data_context::DataContext};
use middlewares::authentication_middleware;
use network_data::{GetPollResultsResponse, GetPollsResponse, VoteRequest};
use sha2::{Digest, Sha256};
use std::net::SocketAddr;
use std::time::SystemTime;
use tokio_postgres::types::{ToSql, Type};
use tower_http::cors::CorsLayer;
use uuid::Uuid;

impl ToSql for common_data::VoteType {
    fn to_sql(
        &self,
        _: &Type,
        out: &mut BytesMut,
    ) -> Result<tokio_postgres::types::IsNull, Box<dyn std::error::Error + Sync + Send>> {
        match self {
            common_data::VoteType::Yea => out.extend_from_slice(b"yea"),
            common_data::VoteType::Nay => out.extend_from_slice(b"nay"),
        }
        Ok(tokio_postgres::types::IsNull::No)
    }

    fn accepts(_: &Type) -> bool {
        true // TODO check if type is equal to VoteType
    }

    tokio_postgres::types::to_sql_checked!();
}

async fn post_vote(
    Extension(data_context): Extension<DataContext>,
    Extension(auth_state): Extension<AuthState>,
    request: JsonRequest<VoteRequest>,
) -> JsonResponse<Uuid> {
    let connection = data_context.get_connection().await;

    let user_id: i32 = auth_state.id;
    let poll_id = request.poll_id;
    let vote_type = request.vote_type;

    connection
        .execute(
            "INSERT INTO votes (user_id, poll_id, vote_type) VALUES ($1, $2, $3)",
            &[&user_id, &poll_id, &vote_type],
        )
        .await
        .unwrap();

    let uuid = Uuid::new_v4();
    JsonResponse(uuid)
}

async fn get_polls(
    Extension(data_context): Extension<DataContext>,
) -> JsonResponse<GetPollsResponse> {
    let connection = data_context.get_connection().await;

    let polls = connection
        .query(
            "SELECT id, name, description, created_at, updated_at FROM polls",
            &[],
        )
        .await
        .unwrap()
        .iter()
        .map(|row| network_data::Poll {
            id: row.get(0),
            name: row.get(1),
            description: row.get(2),
            created_at: SystemTime::into(row.get(3)),
            updated_at: SystemTime::into(row.get(4)),
        })
        .collect();

    let response = GetPollsResponse { polls };

    JsonResponse(response)
}

async fn get_poll_results(
    Extension(data_context): Extension<DataContext>,
    Path(poll_id): Path<i32>,
) -> JsonResponse<GetPollResultsResponse> {
    let connection = data_context.get_connection().await;

    let counts = connection
        .query_one(
            "
                SELECT
                    COUNT(*) FILTER (WHERE vote_type = 'yea') AS yes_votes,
                    COUNT(*) FILTER (WHERE vote_type = 'nay') AS no_votes
                FROM (
                    SELECT DISTINCT ON (user_id)
                        poll_id, user_id, vote_type
                    FROM votes
                    WHERE poll_id = $1
                    ORDER BY user_id, created_at DESC
                ) AS latest_votes
            ",
            &[&poll_id],
        )
        .await
        .unwrap();

    let yes_votes = counts.get("yes_votes");
    let no_votes = counts.get("no_votes");

    let response = GetPollResultsResponse {
        yes_votes,
        no_votes,
    };

    JsonResponse(response)
}

async fn get_username(Extension(auth_state): Extension<AuthState>) -> JsonResponse<String> {
    let username = auth_state.name.clone();

    JsonResponse(username)
}

async fn login(
    Extension(data_context): Extension<DataContext>,
    request: JsonRequest<network_data::LoginRequest>,
) -> Response<Full<Bytes>> {
    let connection = data_context.get_connection().await;

    let username = &request.username;
    let password = &request.password;

    let query = connection
        .query_one(
            "SELECT id, password, password_salt FROM users WHERE name = $1",
            &[&username],
        )
        .await;

    let user = match query {
        Ok(user) => user,
        Err(_) => {
            return Response::builder()
                .status(StatusCode::UNAUTHORIZED)
                .body(Full::from("Unauthorized"))
                .unwrap();
        }
    };

    let user_id: i32 = user.get(0);
    let password_hash: String = user.get(1);
    let password_salt: String = user.get(2);

    let hasher = Sha256::new()
        .chain_update(password_salt)
        .chain_update(password)
        .finalize();
    let hashed_password: String = format!("{:x}", hasher);

    if password_hash != hashed_password {
        return Response::builder()
            .status(StatusCode::UNAUTHORIZED)
            .body(Full::from("Unauthorized"))
            .unwrap();
    }

    let session_token = Uuid::new_v4().to_string();

    connection
        .execute(
            "INSERT INTO sessions (user_id, token) VALUES ($1, $2)",
            &[&user_id, &session_token],
        )
        .await
        .unwrap();

    let cookie = Cookie::build("session_token", session_token)
        .http_only(true)
        .finish();

    Response::builder()
        .status(StatusCode::OK)
        .header("Set-Cookie", cookie.to_string())
        .body(Full::from("OK"))
        .unwrap()
}

async fn logout() -> Response<Full<Bytes>> {
    let cookie = Cookie::build("session_token", "").http_only(true).finish();

    Response::builder()
        .status(StatusCode::OK)
        .header("Set-Cookie", cookie.to_string())
        .body(Full::from("OK"))
        .unwrap()
}

#[tokio::main]
async fn main() {
    let data_context = DataContext::from_connection_string(
        "host=127.0.0.1 user=postgres password=postgres dbname=liquid_democracy",
    )
    .await;

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(["http://localhost:3000".parse().unwrap()])
        .allow_headers([axum::http::header::CONTENT_TYPE])
        .allow_credentials(true);

    let app = Router::new()
        .route("/vote", post(post_vote))
        .route("/polls", get(get_polls))
        .route("/polls/:poll_id/results", get(get_poll_results))
        .route("/username", get(get_username))
        .layer(axum::middleware::from_fn(authentication_middleware))
        .route("/login", post(login))
        .route("/logout", post(logout))
        .layer(cors)
        .layer(Extension(data_context));
    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
