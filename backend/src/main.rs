use axum::{routing::post, Router};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use std::sync::Arc;
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
enum VoteType {
    Yea,
    Nay,
}

#[derive(Debug, Deserialize, Serialize)]
struct Vote {
    user_id: Uuid,
    poll_id: Uuid,
    vote_type: VoteType,
}

struct Block {
    prev: Option<Box<Block>>,
    vote_type: VoteType,
}

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

struct AppState {
    block_chain: BlockChain,
}

async fn vote_handler(vote: axum::extract::Json<Vote>, app_state: axum::extract::State<Arc<AppState>>) -> axum::response::Json<Uuid> {
    let uuid = Uuid::new_v4();
    let block_chain = & app_state.block_chain;

    axum::response::Json(uuid)
}

#[tokio::main]
async fn main() {
    let app_state = Arc::new(AppState {
        block_chain: BlockChain::new(),
    });
    let app = Router::new()
        .route("/vote", post(vote_handler))
        .with_state(app_state);
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
