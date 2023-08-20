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
    pub comments: i64,
    pub whistles: i64,
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
            "
                SELECT
                    polls.id,
                    polls.name,
                    polls.description,
                    COALESCE(COUNT(comments.id), 0) AS comments,
                    COALESCE(COUNT(whistles.id), 0) AS whistles,
                    polls.created_at,
                    polls.updated_at
                FROM polls
                LEFT JOIN comments ON comments.poll_id = polls.id
                LEFT JOIN whistles ON whistles.poll_id = polls.id
                WHERE polls.id = $1
                GROUP BY polls.id
            ",
            &[&id],
        )
        .await
        .unwrap();

    let poll = PollResponse {
        id: poll.get(0),
        name: poll.get(1),
        description: poll.get(2),
        comments: poll.get(3),
        whistles: poll.get(4),
        created_at: SystemTime::into(poll.get(5)),
        updated_at: SystemTime::into(poll.get(6)),
    };

    JsonResponse(poll)
}
