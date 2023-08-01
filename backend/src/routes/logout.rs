use axum::{
    body::{Bytes, Full},
    http::StatusCode,
    response::Response,
};
use cookie::Cookie;

pub async fn post() -> Response<Full<Bytes>> {
    let cookie = Cookie::build("session_token", "").http_only(true).finish();

    Response::builder()
        .status(StatusCode::OK)
        .header("Set-Cookie", cookie.to_string())
        .body(Full::from("OK"))
        .unwrap()
}
