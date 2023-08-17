use bytes::BytesMut;
use serde::{Deserialize, Serialize};
use std::error::Error;
use tokio_postgres::types::{IsNull, ToSql, Type, FromSql};

#[derive(Debug, Deserialize, Serialize, Copy, Clone)]
pub enum VoteType {
    Yea,
    Nay,
    Abstain,
}

impl ToSql for VoteType {
    fn to_sql(&self, _: &Type, out: &mut BytesMut) -> Result<IsNull, Box<dyn Error + Sync + Send>> {
        match self {
            VoteType::Yea => out.extend_from_slice(b"yea"),
            VoteType::Nay => out.extend_from_slice(b"nay"),
            VoteType::Abstain => out.extend_from_slice(b"abstain"),
        }
        Ok(IsNull::No)
    }

    fn accepts(_: &Type) -> bool {
        true // TODO check if type is equal to VoteType
    }

    tokio_postgres::types::to_sql_checked!();
}

impl FromSql<'_> for VoteType {
    fn from_sql(_: &Type, raw: &[u8]) -> Result<Self, Box<dyn Error + Sync + Send>> {
        match raw {
            b"yea" => Ok(VoteType::Yea),
            b"nay" => Ok(VoteType::Nay),
            b"abstain" => Ok(VoteType::Abstain),
            _ => Err("Unrecognized enum variant".into()),
        }
    }

    fn accepts(_: &Type) -> bool {
        true // TODO check if type is equal to VoteType
    }
}
