use axum::{
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
};
use cookie::Cookie;

use crate::extensions::{
    auth_state::AuthState,
    data_context::{Connection, DataContext, Params},
};

fn extract_session_token<B>(request: &Request<B>) -> Option<String> {
    let cookie_string = match request.headers().get("Cookie") {
        Some(cookie_string) => cookie_string,
        _ => return None,
    };

    let cookie = match Cookie::parse(cookie_string.to_str().unwrap()) {
        Ok(cookie) => cookie,
        _ => return None,
    };

    let session_token = match cookie.name() {
        "session_token" => cookie.value().to_string(),
        _ => return None,
    };

    Some(session_token)
}

async fn get_database_connection<B>(request: &Request<B>) -> Connection {
    let data_context = request.extensions().get::<DataContext>().unwrap();
    let connection = data_context.get_connection().await;

    connection
}

async fn get_auth_state<B>(session_token: &str, connection: &Connection<'_>) -> Option<AuthState> {
    let query = "
        SELECT u.id, u.name FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.token = $1
    ";
    let params: Params = &[&session_token];
    let query_result = connection.query_one(query, params).await;

    let data = match query_result {
        Ok(data) => data,
        _ => return None,
    };

    Some(AuthState {
        id: data.get(0),
        name: data.get(1),
    })
}

async fn authenticate_user<B>(request: &Request<B>) -> Option<AuthState> {
    let session_token = match extract_session_token(request) {
        Some(session_token) => session_token,
        _ => return None,
    };

    let connection = get_database_connection(&request).await;
    let auth_state = get_auth_state::<B>(&session_token, &connection).await;

    auth_state
}

pub async fn authentication_middleware<B>(
    mut request: Request<B>,
    next: Next<B>,
) -> Result<Response, StatusCode> {
    let auth_state = match authenticate_user(&request).await {
        Some(auth_state) => auth_state,
        _ => return Err(StatusCode::UNAUTHORIZED),
    };

    request.extensions_mut().insert(auth_state);

    Ok(next.run(request).await)
}
