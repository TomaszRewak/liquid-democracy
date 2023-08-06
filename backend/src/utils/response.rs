use axum::{response::Response, body::{Bytes, Full}, http::StatusCode};

pub type CodeResponse = Response<Full<Bytes>>;

pub fn response_with_code(code: StatusCode) -> CodeResponse {
    Response::builder()
        .status(code)
        .body(Full::from(code.to_string()))
        .unwrap()
}