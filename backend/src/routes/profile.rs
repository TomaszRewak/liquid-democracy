use crate::{
    extensions::{auth_state::AuthState, data_context::DataContext},
    utils::response::{response_with_code, CodeResponse},
};
use axum::{
    extract::Json as JsonRequest, http::StatusCode, response::Json as JsonResponse, Extension,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct PartyAffiliation {
    pub name: String,
    pub color: String,
    pub is_member: bool,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ProfileResponse {
    pub username: String,
    pub party_affiliation: Option<PartyAffiliation>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UpdateProfileRequest {
    pub party_id: i32,
}

pub async fn get(
    Extension(auth_state): Extension<AuthState>,
    Extension(data_context): Extension<DataContext>,
) -> JsonResponse<ProfileResponse> {
    let user_id = auth_state.id;
    let username = auth_state.name;

    let connection = data_context.get_connection().await;

    let query_result = connection
        .query_one(
            "
                SELECT name, color, is_member 
                FROM party_affiliations
                LEFT JOIN parties 
                    ON party_affiliations.party_id = parties.id
                WHERE user_id = $1
                ORDER BY party_affiliations.created_at DESC
                LIMIT 1
            ",
            &[&user_id],
        )
        .await;

    let party_affiliation = match query_result {
        Ok(row) => Some(PartyAffiliation {
            name: row.get(0),
            color: row.get(1),
            is_member: row.get(2),
        }),
        Err(_) => None,
    };

    JsonResponse(ProfileResponse {
        username,
        party_affiliation,
    })
}

pub async fn post(
    Extension(auth_state): Extension<AuthState>,
    Extension(data_context): Extension<DataContext>,
    update_profile_request: JsonRequest<UpdateProfileRequest>,
) -> CodeResponse {
    let user_id = auth_state.id;
    let party_id = update_profile_request.party_id;

    let connection = data_context.get_connection().await;

    connection
        .execute(
            "
                INSERT INTO party_affiliations (user_id, party_id)
                VALUES ($1, $2)
            ",
            &[&user_id, &party_id],
        )
        .await
        .unwrap();

    response_with_code(StatusCode::OK)
}
