use bytes::BytesMut;
use serde::{Deserialize, Serialize};
use std::error::Error;
use tokio_postgres::types::{IsNull, ToSql, Type};

#[derive(Debug, Deserialize, Serialize, Copy, Clone)]
pub enum VoteType {
    Yea,
    Nay,
}

impl ToSql for VoteType {
    fn to_sql(&self, _: &Type, out: &mut BytesMut) -> Result<IsNull, Box<dyn Error + Sync + Send>> {
        match self {
            VoteType::Yea => out.extend_from_slice(b"yea"),
            VoteType::Nay => out.extend_from_slice(b"nay"),
        }
        Ok(IsNull::No)
    }

    fn accepts(_: &Type) -> bool {
        true // TODO check if type is equal to VoteType
    }

    tokio_postgres::types::to_sql_checked!();
}
