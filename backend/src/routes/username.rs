use crate::extensions::auth_state::AuthState;
use axum::{response::Json as JsonResponse, Extension};

pub async fn get(Extension(auth_state): Extension<AuthState>) -> JsonResponse<String> {
    let username = auth_state.name.clone();

    JsonResponse(username)
}
