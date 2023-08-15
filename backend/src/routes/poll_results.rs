use crate::extensions::data_context::DataContext;
use axum::{extract::Path, response::Json as JsonResponse, Extension};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct VoteRatio {
    yes_votes: f64,
    no_votes: f64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct VoteBreakdown {
    electorial_votes: VoteRatio,
    popular_votes: VoteRatio,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct VotesByParty {
    party: Option<String>,
    votes: i64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct GetPollResultsResponse {
    votes_by_party: Vec<VotesByParty>,
}

pub async fn get(
    Extension(data_context): Extension<DataContext>,
    Path(poll_id): Path<i32>,
) -> JsonResponse<GetPollResultsResponse> {
    let connection = data_context.get_connection().await;

    let counts = connection
        .query_one(
            "
                SELECT
                    COUNT(*) FILTER (WHERE vote_type = 'yea') AS yes_votes,
                    COUNT(*) FILTER (WHERE vote_type = 'nay') AS no_votes
                FROM (
                    SELECT DISTINCT ON (user_id)
                        poll_id, user_id, vote_type
                    FROM votes
                    WHERE poll_id = $1
                    ORDER BY user_id, created_at DESC
                ) AS latest_votes
            ",
            &[&poll_id],
        )
        .await
        .unwrap();

    let yes_votes = counts.get("yes_votes");
    let no_votes = counts.get("no_votes");

    let response = GetPollResultsResponse {
        yes_votes,
        no_votes,
    };

    JsonResponse(response)
}
