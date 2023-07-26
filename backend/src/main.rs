mod common_data;
mod network_data;

use axum::extract::{Json as JsonRequest, Path, State};
use axum::http::{Method, request, StatusCode};
use axum::response::Json as JsonResponse;
use axum::Extension;
use axum::{routing::get, routing::post, Router};
use bb8_postgres::bb8::PooledConnection;
use bb8_postgres::{bb8::Pool, PostgresConnectionManager};
use bytes::BytesMut;
use cookie::Cookie;
use network_data::{GetPollResultsResponse, GetPollsResponse, VoteRequest};
use std::f32::consts::E;
use std::net::SocketAddr;
use std::time::SystemTime;
use tokio_postgres::types::{ToSql, Type};
use tower_http::cors::CorsLayer;
use uuid::Uuid;

type ConnectionPool = Pool<PostgresConnectionManager<tokio_postgres::NoTls>>;
type Connection<'a> = PooledConnection<'a, PostgresConnectionManager<tokio_postgres::NoTls>>;

#[derive(Clone)]
struct AppState {
    postgres_connection_pool: ConnectionPool,
}

#[derive(Clone)]
struct AuthState {
    user_id: Option<i32>,
}

impl AppState {
    async fn get_connection(&self) -> Connection {
        self.postgres_connection_pool.get().await.unwrap()
    }
}

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
    Extension(app_state): Extension<AppState>,
    request: JsonRequest<VoteRequest>,
) -> JsonResponse<Uuid> {
    let connection = app_state.get_connection().await;

    let user_id: i32 = 1;
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

async fn get_polls(Extension(app_state): Extension<AppState>) -> JsonResponse<GetPollsResponse> {
    let connection = app_state.get_connection().await;

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
    Extension(app_state): Extension<AppState>,
    Path(poll_id): Path<i32>,
) -> JsonResponse<GetPollResultsResponse> {
    let connection = app_state.get_connection().await;

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

async fn authenticate_user<B>(
    request: &axum::http::Request<B>,
) -> Option<i32> {
    let session_token = request
        .headers()
        .get_all("Cookie")
        .iter()
        .find_map(|cookie| {
            cookie
                .to_str()
                .ok()
                .and_then(|cookie| cookie.parse::<cookie::Cookie>().ok())
                .filter(|cookie| cookie.name() == "session_token")
                .map(|cookie| cookie.value().to_owned().parse::<i32>().ok())
                .flatten()
        });

    if session_token.is_none() {
        return None;
    }

    let app_state = request.extensions().get::<Extension<AppState>>().unwrap();
    let connection = app_state.get_connection().await;

    let user_id = connection
        .query_one(
            "SELECT user_id FROM sessions WHERE token = $1",
            &[&session_token],
        )
        .await
        .unwrap()
        .get(0);

    Some(user_id)
}

async fn authentication_middleware<B>(
    mut request: axum::http::Request<B>,
    next: axum::middleware::Next<B>,
) -> Result<axum::response::Response, StatusCode> {
    let user_id = authenticate_user(&request).await;

    if user_id.is_none() {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let auth_state = AuthState { user_id: user_id };

    request.extensions_mut().insert(auth_state);

    Ok(next.run(request).await)
}

#[tokio::main]
async fn main() {
    let postgres_manager = PostgresConnectionManager::new_from_stringlike(
        "host=127.0.0.1 user=postgres password=postgres dbname=liquid_democracy",
        tokio_postgres::NoTls,
    )
    .unwrap();
    let postgres_connection_pool = Pool::builder().build(postgres_manager).await.unwrap();

    let app_state: AppState = AppState {
        postgres_connection_pool: postgres_connection_pool,
    };

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(["http://localhost:3000".parse().unwrap()])
        .allow_headers([axum::http::header::CONTENT_TYPE]);

    let app = Router::new()
        .route("/vote", post(post_vote))
        .route("/polls", get(get_polls))
        .route("/polls/:poll_id/results", get(get_poll_results))
        .layer(axum::middleware::from_fn(authentication_middleware))
        .layer(cors)
        .layer(Extension(app_state))
        .layer(Extension(AuthState { user_id: None }));
    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
