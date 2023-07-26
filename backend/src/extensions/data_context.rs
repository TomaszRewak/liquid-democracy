use bb8_postgres::{
    bb8::{Pool, PooledConnection},
    PostgresConnectionManager,
};
use tokio_postgres::NoTls;

type Connection<'a> = PooledConnection<'a, PostgresConnectionManager<tokio_postgres::NoTls>>;
type ConnectionPool = Pool<PostgresConnectionManager<NoTls>>;
type ConnectionManager = PostgresConnectionManager<NoTls>;

#[derive(Clone)]
pub struct DataContext {
    connection_pool: ConnectionPool,
}

fn create_connection_manager(connection_string: &str) -> ConnectionManager {
    PostgresConnectionManager::new_from_stringlike(connection_string, NoTls).unwrap()
}

async fn create_connection_pool(connection_manager: ConnectionManager) -> ConnectionPool {
    Pool::builder().build(connection_manager).await.unwrap()
}

async fn extract_connection(connection_pool: &ConnectionPool) -> Connection {
    connection_pool.get().await.unwrap()
}

impl DataContext {
    pub async fn from_connection_string(connection_string: &str) -> Self {
        let connection_manager = create_connection_manager(connection_string);
        let connection_pool = create_connection_pool(connection_manager).await;

        Self { connection_pool }
    }

    pub async fn get_connection(&self) -> Connection {
        extract_connection(&self.connection_pool).await
    }
}
