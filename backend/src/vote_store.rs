use std::path::PathBuf;

use uuid::Uuid;

use crate::common_data::VoteType;

struct Vote {
    user_id: Uuid,
    poll_id: Uuid,
    vote_type: VoteType,
}

pub struct VoteStore {
    path: PathBuf,
    last_vote: Option<Vote>,
}

impl VoteStore {
    pub fn new(path: PathBuf) -> Self {
        Self {
            path,
            last_vote: None,
        }
    }
}
