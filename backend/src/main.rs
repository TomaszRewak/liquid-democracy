mod common_data;
mod network_data;

use axum::http::Method;
use axum::{
    routing::{get, post},
    Router,
};
use bb8_postgres::{
    bb8::{Pool, PooledConnection},
    PostgresConnectionManager,
};
use network_data::VoteRequest;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::{collections::HashMap, net::SocketAddr, path::PathBuf};
use tokio::sync::Mutex;
use tokio_postgres::types::{ToSql, Type};
use tower_http::cors::CorsLayer;
use uuid::Uuid;
use bytes::BytesMut;

#[derive(Clone)]
struct AppState {
    postgres_connection_pool: Arc<Mutex<Pool<PostgresConnectionManager<tokio_postgres::NoTls>>>>,
}

impl ToSql for common_data::VoteType {
    fn to_sql(&self, _: &Type, out: &mut BytesMut) -> Result<tokio_postgres::types::IsNull, Box<dyn std::error::Error + Sync + Send>> {
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

async fn vote_handler(
    axum::extract::State(app_state): axum::extract::State<AppState>,
    vote: axum::extract::Json<VoteRequest>,
) -> axum::response::Json<Uuid> {
    let connection_pool = app_state.postgres_connection_pool.lock().await;
    let connection = connection_pool.get().await.unwrap();

    let user_id: i32 = 1;
    let poll_id: i32 = 1;
    let vote_type = vote.vote_type;

    connection
        .execute(
            "INSERT INTO votes (user_id, poll_id, vote_type) VALUES ($1, $2, $3)",
            &[&user_id, &poll_id, &vote_type],
        )
        .await
        .unwrap();

    let uuid = Uuid::new_v4();
    axum::response::Json(uuid)
}

// async fn get_block_chain(
//     axum::extract::State(app_state): axum::extract::State<AppState>,
// ) -> axum::response::Json<BlockChain> {
//     let block_chain = app_state.block_chain.lock().await;

//     axum::response::Json(block_chain.clone())
// }

#[tokio::main]
async fn main() {
    let postgres_manager = PostgresConnectionManager::new_from_stringlike(
        "host=127.0.0.1 user=postgres password=postgres dbname=liquid_democracy",
        tokio_postgres::NoTls,
    )
    .unwrap();
    let postgres_connection_pool = Pool::builder().build(postgres_manager).await.unwrap();

    let app_state: AppState = AppState {
        postgres_connection_pool: Arc::new(Mutex::new(postgres_connection_pool)),
    };

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(["http://localhost:3000".parse().unwrap()])
        .allow_headers([axum::http::header::CONTENT_TYPE]);

    let app = Router::new()
        .route("/vote", post(vote_handler))
        //.route("/chain", get(get_block_chain))
        .layer(cors)
        .with_state(app_state);
    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
