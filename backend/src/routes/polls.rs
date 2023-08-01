use axum::{response::Json as JsonResponse, Extension};
use chrono::{serde::ts_seconds, DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::time::SystemTime;

use crate::extensions::data_context::DataContext;

#[derive(Debug, Deserialize, Serialize)]
pub struct Poll {
    pub id: i32,
    pub name: String,
    pub description: String,
    #[serde(with = "ts_seconds")]
    pub created_at: DateTime<Utc>,
    #[serde(with = "ts_seconds")]
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct GetPollsResponse {
    pub polls: Vec<Poll>,
}

pub async fn get(
    Extension(data_context): Extension<DataContext>,
) -> JsonResponse<GetPollsResponse> {
    let connection = data_context.get_connection().await;

    let polls = connection
        .query(
            "SELECT id, name, description, created_at, updated_at FROM polls",
            &[],
        )
        .await
        .unwrap()
        .iter()
        .map(|row| Poll {
            id: row.get(0),
            name: row.get(1),
            description: row.get(2),
            created_at: SystemTime::into(row.get(3)),
            updated_at: SystemTime::into(row.get(4)),
        })
        .collect();

    let response = GetPollsResponse { polls };

    JsonResponse(response)
}
