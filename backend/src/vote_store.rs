use std::{
    fmt::Display,
    fs::OpenOptions,
    io::{ErrorKind, Read, Seek, SeekFrom, Write, LineWriter},
    os::windows::prelude::FileExt,
    path::PathBuf,
    str::FromStr,
};

use uuid::Uuid;

use crate::common_data::VoteType;

#[derive(Clone)]
pub struct Vote {
    pub user_id: Uuid,
    pub vote_type: VoteType,
    pub block_hash: String,
}

impl Vote {
    const FORMATTED_SIZE: usize = 44;
}

impl Display for Vote {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{:?},{:?},{:?}",
            self.user_id, self.vote_type, self.block_hash
        )
    }
}

impl FromStr for Vote {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        type Err = ();

        let mut parts = s.split(',');

        let user_id = Uuid::parse_str(parts.next().unwrap()).unwrap();
        let poll_id = Uuid::parse_str(parts.next().unwrap()).unwrap();
        let vote_type = match parts.next().unwrap() {
            "Yea" => VoteType::Yea,
            "Nay" => VoteType::Nay,
            _ => panic!("Invalid vote type"),
        };
        let block_hash = parts.next().unwrap().to_string();

        Ok(Self {
            user_id,
            vote_type,
            block_hash,
        })
    }
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

    pub fn add_vote(&mut self, vote: Vote) {
        let mut file = OpenOptions::new()
            .append(true)
            .create(true)
            .open(&self.path)
            .unwrap();

        writeln!(file, "{}", vote.to_string()).unwrap();

        self.last_vote = Some(vote);
    }

    pub fn get_last_vote(&self) -> Option<Vote> {
        if self.last_vote.is_some() {
            return self.last_vote.clone();
        }

        let file_result = OpenOptions::new().read(true).open(&self.path);

        let mut file = match file_result {
            Ok(file) => file,
            Err(error) if error.kind() == ErrorKind::NotFound => return None,
            _ => panic!("Error opening file"),
        };

        let mut buffer = [0; Vote::FORMATTED_SIZE];

        file.seek(SeekFrom::End(Vote::FORMATTED_SIZE as i64 + 1))
            .unwrap();
        file.read_exact(&mut buffer).unwrap();

        let vote_string = String::from_utf8_lossy(&buffer);

        return Some(Vote::from_str(&vote_string).unwrap());
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn vote_formatted_size() {
        let vote = Vote {
            user_id: Uuid::new_v4(),
            vote_type: VoteType::Yea,
            block_hash: String::from("1"),
        };

        assert_eq!(Vote::FORMATTED_SIZE, vote.to_string().len());
    }
}
