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
                WITH
                end_time AS (
                    SELECT
                        polls.end_time AS end_time
                    FROM
                        polls
                    WHERE
                        polls.id = $1
                ),
                current_party_affiliations AS (
                    SELECT DISTINCT ON (party_affiliations.user_id)
                        party_affiliations.user_id AS user_id,
                        party_affiliations.party_id AS party_id,
                        party_affiliations.is_member AS is_member
                    FROM
                        party_affiliations
                    INNER JOIN
                        end_time ON end_time.end_time >= party_affiliations.created_at
                    ORDER BY
                        party_affiliations.user_id,
                        party_affiliations.created_at DESC
                ),
                all_votes AS (
                    SELECT DISTINCT ON (votes.user_id)
                        votes.vote_type AS vote_type,
                        votes.user_id AS user_id,
                        current_party_affiliations.party_id AS party_id,
                        current_party_affiliations.is_member AS is_member
                    FROM
                        votes
                    LEFT JOIN
                        current_party_affiliations ON current_party_affiliations.user_id = votes.user_id
                    WHERE
                        votes.poll_id = $1
                    ORDER BY
                        votes.user_id,
                        votes.created_at DESC
                ),
                party_votes AS (
                    SELECT
                        party_id,
                        COUNT(*) FILTER (WHERE vote_type = 'yea') AS yea_votes,
                        COUNT(*) FILTER (WHERE vote_type = 'nay') AS nay_votes,
                        COUNT(*) FILTER (WHERE vote_type = 'abstain') AS abstain_votes,
                        COUNT(*) AS total_votes
                    FROM
                        all_votes
                    WHERE
                        is_member = TRUE
                    GROUP BY
                        party_id
                ),
                party_mandate AS (
                    SELECT
                        current_party_affiliations.party_id AS party_id,
                        COUNT(*) AS mandate
                    FROM
                        current_party_affiliations
                    LEFT JOIN
                        all_votes ON all_votes.user_id = current_party_affiliations.user_id
                    WHERE
                        all_votes.user_id IS NULL
                    GROUP BY
                        current_party_affiliations.party_id
                ),
                electorial_votes AS (
                    SELECT
                        party_votes.party_id AS party_id,
                        party_mandate.mandate * (party_votes.yea_votes::float / party_votes.total_votes) AS yea_votes,
                        party_mandate.mandate * (party_votes.nay_votes::float / party_votes.total_votes) AS nay_votes,
                        party_mandate.mandate * (party_votes.abstain_votes::float / party_votes.total_votes) AS abstain_votes
                    FROM
                        party_votes
                    INNER JOIN
                        party_mandate ON party_mandate.party_id = party_votes.party_id
                ),
                popular_votes AS (
                    SELECT
                        party_id,
                        COUNT(*) FILTER (WHERE vote_type = 'yea') AS yea_votes,
                        COUNT(*) FILTER (WHERE vote_type = 'nay') AS nay_votes,
                        COUNT(*) FILTER (WHERE vote_type = 'abstain') AS abstain_votes
                    FROM
                        all_votes
                    GROUP BY
                        party_id
                )
                SELECT
                    COALESCE(electorial_votes.party_id, popular_votes.party_id) AS party_id,
                    COALESCE(electorial_votes.yea_votes, 0) AS electorial_yea_votes,
                    COALESCE(electorial_votes.nay_votes, 0) AS electorial_nay_votes,
                    COALESCE(electorial_votes.abstain_votes, 0) AS electorial_abstain_votes,
                    COALESCE(popular_votes.yea_votes, 0) AS popular_yea_votes,
                    COALESCE(popular_votes.nay_votes, 0) AS popular_nay_votes,
                    COALESCE(popular_votes.abstain_votes, 0) AS popular_abstain_votes
                FROM
                    electorial_votes
                FULL OUTER JOIN
                    popular_votes ON popular_votes.party_id = electorial_votes.party_id
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
