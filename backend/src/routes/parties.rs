use axum::{response::Json as JsonResponse, Extension};
use serde::{Deserialize, Serialize};

use crate::extensions::data_context::DataContext;

#[derive(Debug, Deserialize, Serialize)]
pub struct Party {
    pub id: i32,
    pub name: String,
    pub color: String,
}

pub async fn get(
    Extension(data_context): Extension<DataContext>,
) -> JsonResponse<Vec<Party>> {
    let connection = data_context.get_connection().await;

    let parties = connection
        .query(
            "SELECT id, name, color FROM parties",
            &[],
        )
        .await
        .unwrap()
        .iter()
        .map(|row| Party {
            id: row.get(0),
            name: row.get(1),
            color: row.get(2),
        })
        .collect();

    JsonResponse(parties)
}
