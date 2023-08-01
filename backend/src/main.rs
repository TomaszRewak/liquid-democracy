mod common_data;
mod extensions;
mod middlewares;
mod routes;

use axum::http::Method;
use axum::Extension;
use axum::{routing::get, routing::post, Router};
use extensions::data_context::DataContext;
use middlewares::authentication_middleware;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

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
        .route("/vote", post(routes::vote::post))
        .route("/polls", get(routes::polls::get))
        .route("/polls/:poll_id/results", get(routes::poll_results::get))
        .route("/username", get(routes::username::get))
        .layer(axum::middleware::from_fn(authentication_middleware))
        .route("/login", post(routes::login::post))
        .route("/logout", post(routes::logout::post))
        .layer(cors)
        .layer(Extension(data_context));
    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
