use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use chrono::serde::ts_seconds;

use crate::common_data::VoteType;

#[derive(Debug, Deserialize, Serialize)]
pub struct VoteRequest {
    pub request_id: Uuid,
    pub vote_id: Uuid, // TODO: change to poll_id
    pub vote_type: VoteType,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct VoteResponse {
    pub request_id: Uuid,
    pub block_hash: String,
}

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
