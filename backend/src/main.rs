use axum::{handler::get, Router};
use uuid::Uuid;

struct Vote {
    id: Uuid,
    name: String,
}

fn main() {
    println!("Hello, world!");
}
