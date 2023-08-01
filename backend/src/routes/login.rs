use crate::extensions::data_context::DataContext;
use axum::body::{Bytes, Full};
use axum::extract::Json as JsonRequest;
use axum::http::StatusCode;
use axum::{response::Response, Extension};
use cookie::Cookie;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use uuid::Uuid;

#[derive(Debug, Deserialize, Serialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

pub async fn post(
    Extension(data_context): Extension<DataContext>,
    request: JsonRequest<LoginRequest>,
) -> Response<Full<Bytes>> {
    let connection = data_context.get_connection().await;

    let username = &request.username;
    let password = &request.password;

    let query = connection
        .query_one(
            "SELECT id, password, password_salt FROM users WHERE name = $1",
            &[&username],
        )
        .await;

    let user = match query {
        Ok(user) => user,
        Err(_) => {
            return Response::builder()
                .status(StatusCode::UNAUTHORIZED)
                .body(Full::from("Unauthorized"))
                .unwrap();
        }
    };

    let user_id: i32 = user.get(0);
    let password_hash: String = user.get(1);
    let password_salt: String = user.get(2);

    let hasher = Sha256::new()
        .chain_update(password_salt)
        .chain_update(password)
        .finalize();
    let hashed_password: String = format!("{:x}", hasher);

    if password_hash != hashed_password {
        return Response::builder()
            .status(StatusCode::UNAUTHORIZED)
            .body(Full::from("Unauthorized"))
            .unwrap();
    }

    let session_token = Uuid::new_v4().to_string();

    connection
        .execute(
            "INSERT INTO sessions (user_id, token) VALUES ($1, $2)",
            &[&user_id, &session_token],
        )
        .await
        .unwrap();

    let cookie = Cookie::build("session_token", session_token)
        .http_only(true)
        .finish();

    Response::builder()
        .status(StatusCode::OK)
        .header("Set-Cookie", cookie.to_string())
        .body(Full::from("OK"))
        .unwrap()
}
