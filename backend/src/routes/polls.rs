use axum::{response::Json as JsonResponse, Extension};
use serde::{Deserialize, Serialize};

use crate::extensions::data_context::DataContext;

#[derive(Debug, Deserialize, Serialize)]
pub struct GetPollsResponse {
    pub polls: Vec<i32>,
}

pub async fn get(
    Extension(data_context): Extension<DataContext>,
) -> JsonResponse<GetPollsResponse> {
    let connection = data_context.get_connection().await;

    let polls = connection
        .query(
            "SELECT id FROM polls",
            &[],
        )
        .await
        .unwrap()
        .iter()
        .map(|row| row.get(0))
        .collect();

    let response = GetPollsResponse { polls };

    JsonResponse(response)
}
