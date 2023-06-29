mod common_data;
mod network_data;

use axum::http::Method;
use axum::{
    routing::{get, post},
    Router,
};
use network_data::VoteRequest;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::{collections::HashMap, net::SocketAddr, path::PathBuf};
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;
use uuid::Uuid;
use bb8_postgres::{PostgresConnectionManager, bb8::{Pool, PooledConnection}};

#[derive(Clone)]
struct AppState {}

async fn vote_handler(
    axum::extract::State(app_state): axum::extract::State<AppState>,
    vote: axum::extract::Json<VoteRequest>,
) -> axum::response::Json<Uuid> {
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
        "host=localhost user=postgres dbname=liquid_democracy",
        tokio_postgres::NoTls,
    ).unwrap();
    let postgres_connection_pool = Pool::builder().build(postgres_manager).await.unwrap();

    let app_state: AppState = AppState {
        //block_chain: Arc::new(Mutex::new(BlockChain::new())),
    };

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(["http://localhost:3000".parse().unwrap()])
        .allow_headers([axum::http::header::CONTENT_TYPE]);

    let app = Router::new()
        .route("/vote", post(vote_handler))
        //.route("/chain", get(get_block_chain))
        .layer(cors)
        .with_state(app_state)
        .with_state(postgres_connection_pool);
    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
