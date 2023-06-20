use serde::{Deserialize, Serialize};
use uuid::Uuid;

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
