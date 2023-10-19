use axum::{extract::Query, response::Json as JsonResponse, Extension};
use serde::{Deserialize, Serialize};

use crate::extensions::data_context::DataContext;

#[derive(Deserialize)]
pub struct GetPollsRequest {
    pub include_expired: bool,
    pub include_upcoming: bool,
    pub text_filter: String,
    pub page: i64,
    pub page_size: i64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct GetPollsResponse {
    pub polls: Vec<i32>,
}

pub async fn get(
    Extension(data_context): Extension<DataContext>,
    Query(query): Query<GetPollsRequest>,
) -> JsonResponse<GetPollsResponse> {
    let connection = data_context.get_connection().await;
    let offset = (query.page - 1) * query.page_size;

    let polls = connection
        .query(
            "
                SELECT
                    polls.id
                FROM polls
                WHERE
                    ($1 OR polls.end_time >= NOW())
                    AND
                    ($2 OR polls.start_time <= NOW())
                    AND
                    ($3 = '' OR polls.name ILIKE '%' || $3 || '%')
                ORDER BY polls.end_time ASC
                LIMIT $4
                OFFSET $5
        ",
            &[
                &query.include_expired,
                &query.include_upcoming,
                &query.text_filter,
                &query.page_size,
                &offset,
            ],
        )
        .await
        .unwrap()
        .iter()
        .map(|row| row.get(0))
        .collect();

    let response = GetPollsResponse { polls };

    JsonResponse(response)
}
