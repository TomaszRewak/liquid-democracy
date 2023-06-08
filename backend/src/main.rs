mod common_data;
mod network_data;

use axum::{
    routing::{get, post},
    Router,
};
use common_data::VoteType;
use network_data::VoteRequest;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::sync::Mutex;
use uuid::Uuid;

struct User {
    id: Uuid,
    name: String,
}

struct Poll {
    id: Uuid,
    name: String,
}

struct Party {
    id: Uuid,
    name: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct Vote {
    user_id: Uuid,
    poll_id: Uuid,
    vote_type: VoteType,
}

#[derive(Debug, Deserialize, Serialize, /* todo: remove */ Clone)]
struct Block {
    prev: Option<Box<Block>>,
    vote_type: VoteType,
}

#[derive(Debug, Deserialize, Serialize, /* todo: remove */ Clone)]
struct BlockChain {
    head: Option<Block>,
}

impl BlockChain {
    fn new() -> Self {
        Self { head: None }
    }

    fn add_block(&mut self, vote_type: VoteType) {
        let block = Block {
            prev: self.head.take().map(Box::new),
            vote_type,
        };
        self.head = Some(block);
    }
}

#[derive(Clone)]
struct AppState {
    block_chain: Arc<Mutex<BlockChain>>,
}

async fn vote_handler(
    axum::extract::State(app_state): axum::extract::State<AppState>,
    vote: axum::extract::Json<VoteRequest>,
) -> axum::response::Json<Uuid> {
    let uuid = Uuid::new_v4();
    let mut block_chain = app_state.block_chain.lock().await;

    block_chain.add_block(vote.vote_type);

    axum::response::Json(uuid)
}

async fn get_block_chain(
    axum::extract::State(app_state): axum::extract::State<AppState>,
) -> axum::response::Json<BlockChain> {
    let block_chain = app_state.block_chain.lock().await;

    axum::response::Json(block_chain.clone())
}

#[tokio::main]
async fn main() {
    let app_state: AppState = AppState {
        block_chain: Arc::new(Mutex::new(BlockChain::new())),
    };
    let app = Router::new()
        .route("/vote", post(vote_handler))
        .route("/chain", get(get_block_chain))
        .with_state(app_state);
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
