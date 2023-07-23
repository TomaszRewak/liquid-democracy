# liquid-democracy

# Step by step setup

### Start the postgresql

```bash
sudo service postgresql start
```

### Rebuild the database

```bash
./database/rebuild.sh
```

### Run frontend

```bash
cd frontend/
npm run build
```

### Run backend

Just hit `F5` in the VSCode.

# Goals:
- A person can verify that the vote was registered and has not been tempered with
