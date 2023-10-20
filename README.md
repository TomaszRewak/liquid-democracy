# liquid-democracy

<p align="center">
  <img src="https://github.com/TomaszRewak/liquid-democracy/blob/master/examples/screenshot.png?raw=true" width=800/>
</p>

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
npm start
```

### Run backend

Just hit `F5` in the VSCode.

# Goals:
- A person can verify that the vote was registered and has not been tempered with
