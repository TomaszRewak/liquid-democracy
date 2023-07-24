mod common_data;
mod network_data;

use axum::extract::{Json as JsonRequest, State};
use axum::http::Method;
use axum::response::Json as JsonResponse;
use axum::{routing::get, routing::post, Router};
use bb8_postgres::bb8::PooledConnection;
use bb8_postgres::{bb8::Pool, PostgresConnectionManager};
use bytes::BytesMut;
use network_data::{GetPollsResponse, VoteRequest};
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
    State(app_state): State<AppState>,
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

async fn get_polls(
    State(app_state): State<AppState>,
) -> JsonResponse<GetPollsResponse> {
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
        .layer(cors)
        .with_state(app_state);
    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
