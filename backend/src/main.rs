use axum::{routing::post, Router};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
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

async fn vote_handler(vote: axum::extract::Json<Vote>) -> axum::response::Json<Uuid> {
    let uuid = Uuid::new_v4();
    axum::response::Json(uuid)
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/vote", post(vote_handler));
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
