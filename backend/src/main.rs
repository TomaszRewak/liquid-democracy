mod common_data;
mod network_data;
mod vote_store;

use axum::http::Method;
use axum::{
    routing::{get, post},
    Router,
};
use common_data::VoteType;
use network_data::VoteRequest;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::{collections::HashMap, net::SocketAddr, path::PathBuf};
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;
use uuid::Uuid;
use vote_store::VoteStore;

struct User {
    id: Uuid,
    name: String,
}

struct Poll {
    pub vote_store: VoteStore,
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
    polls: Arc<Mutex<HashMap<Uuid, Poll>>>,
    block_chain: Arc<Mutex<BlockChain>>,
}

async fn vote_handler(
    axum::extract::State(app_state): axum::extract::State<AppState>,
    vote: axum::extract::Json<VoteRequest>,
) -> axum::response::Json<Uuid> {
    let uuid = Uuid::new_v4();

    let mut polls = app_state.polls.lock().await;
    let poll = polls.entry(vote.vote_id).or_insert_with(|| Poll {
        vote_store: VoteStore::new(PathBuf::from(format!(
            "C:\\Users\\Tomasz\\Programy\\Temp\\{}.csv",
            vote.vote_id
        ))),
    });

    let last_vote = poll.vote_store.get_last_vote();
    let block_hash = match last_vote {
        Some(last_vote) => last_vote.block_hash,
        None => String::from("1"),
    };

    poll.vote_store
        .add_vote(vote_store::Vote {
            user_id: uuid,
            vote_type: vote.vote_type,
            block_hash,
        });

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
        polls: Arc::new(Mutex::new(HashMap::new())),
        block_chain: Arc::new(Mutex::new(BlockChain::new())),
    };

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(["http://localhost:3000".parse().unwrap()])
        .allow_headers([axum::http::header::CONTENT_TYPE]);

    let app = Router::new()
        .route("/vote", post(vote_handler))
        .route("/chain", get(get_block_chain))
        .layer(cors)
        .with_state(app_state);
    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
