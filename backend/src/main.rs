use uuid::Uuid;

struct User {
    id: Uuid,
    name: String,
}

struct Poll {
    id: Uuid,
    name: String,
}

struct Party {
    id: Uuid,
    name: String,
}

fn main() {
    println!("Hello, world!");
}
