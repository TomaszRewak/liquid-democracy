use axum::{extract::Path, response::Json as JsonResponse, Extension};
use chrono::{serde::ts_seconds, DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::time::SystemTime;

use crate::extensions::data_context::DataContext;

#[derive(Debug, Deserialize, Serialize)]
pub struct PollResponse {
    pub id: i32,
    pub name: String,
    pub description: String,
    #[serde(with = "ts_seconds")]
    pub created_at: DateTime<Utc>,
    #[serde(with = "ts_seconds")]
    pub updated_at: DateTime<Utc>,
}

pub async fn get(
    Extension(data_context): Extension<DataContext>,
    Path(id): Path<i32>,
) -> JsonResponse<PollResponse> {
    let connection = data_context.get_connection().await;

    let poll = connection
        .query_one(
            "SELECT id, name, description, created_at, updated_at FROM polls WHERE id = $1",
            &[&id],
        )
        .await
        .unwrap();

    let poll = PollResponse {
        id: poll.get(0),
        name: poll.get(1),
        description: poll.get(2),
        created_at: SystemTime::into(poll.get(3)),
        updated_at: SystemTime::into(poll.get(4)),
    };

    JsonResponse(poll)
}
