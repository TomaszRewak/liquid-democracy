# liquid-democracy

This website is a simple proof of concept that explores an idea of voting within a liquid democracy political system.

In essence, liquid democracy is similar to the regular democracy known from common elections and parliament voting. Every member of the society has a right to choose their representatives. It's usually done by electing political parties. The number of supporters each party obtained is then proportional to the number of ballots those parties can cast in individual votes. Liquid democracy follows the same base principles, with one core difference. Each member of the society can decide to withdraw their support from elected representative for a duration of a single vote and can cast their ballot themselves - in accordance with their own beliefs. This way voters can have a direct impact over the decisions made by the government, even outside of the election period. In particular, voters can oppose the passing of a specific laws, whenever the interests of the society and the political class are not aligned.

Is liquid democracy a better system overall? I'm not necessarily claiming that. It's just an interesting idea that I think is worth exploring.

<p align="center">
  <img src="https://github.com/TomaszRewak/liquid-democracy/blob/master/examples/screenshot.png?raw=true" width=800/>
</p>

# Technicalities

The project is divided into two parts: frontend and backend. The frontend is a simple React application that allows users to cast their votes. The backend is a rust-based REST API that handles the communication with a PostgreSQL database.

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
