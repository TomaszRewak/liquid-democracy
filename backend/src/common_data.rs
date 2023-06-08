use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, Copy, Clone)]
pub enum VoteType {
    Yea,
    Nay,
}
