use crate::{
    common_data::VoteType,
    extensions::{auth_state::AuthState, data_context::DataContext},
};
use axum::{extract::Json as JsonRequest, response::Json as JsonResponse, Extension};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Deserialize, Serialize)]
pub struct VoteRequest {
    pub request_id: Uuid,
    pub poll_id: i32,
    pub vote_type: VoteType,
}

pub async fn post(
    Extension(data_context): Extension<DataContext>,
    Extension(auth_state): Extension<AuthState>,
    request: JsonRequest<VoteRequest>,
) -> JsonResponse<Uuid> {
    let connection = data_context.get_connection().await;

    let user_id: i32 = auth_state.id;
    let poll_id = request.poll_id;
    let vote_type = request.vote_type;

    connection
        .execute(
            "INSERT INTO votes (user_id, poll_id, vote_type) VALUES ($1, $2, $3)",
            &[&user_id, &poll_id, &vote_type],
        )
        .await
        .unwrap();

    let uuid = Uuid::new_v4();
    JsonResponse(uuid)
}
