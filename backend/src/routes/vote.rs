use crate::{
    common_data::VoteType,
    extensions::{auth_state::AuthState, data_context::DataContext},
};
use axum::{
    extract::{Json as JsonRequest, Path},
    response::Json as JsonResponse,
    Extension,
};
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

pub async fn get(
    Extension(data_context): Extension<DataContext>,
    Extension(auth_state): Extension<AuthState>,
    Path(poll_id): Path<i32>,
) -> JsonResponse<Option<VoteType>> {
    let connection = data_context.get_connection().await;

    let user_id: i32 = auth_state.id;

    let query_result = connection
        .query(
            "
                SELECT 
                    vote_type 
                FROM votes
                WHERE user_id = $1 AND poll_id = $2
                ORDER BY created_at DESC
                LIMIT 1
            ",
            &[&user_id, &poll_id],
        )
        .await
        .unwrap();

    let vote_type = if query_result.is_empty() {
        None
    } else {
        let vote_type: VoteType = query_result[0].get(0);
        Some(vote_type)
    };

    JsonResponse(vote_type)
}
