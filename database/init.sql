-- psql -U postgres -h 127.0.0.1 -d liquid_democracy -f .../liquid-democracy/database/init.sql
CREATE TYPE vote_type AS ENUM ('yea', 'nay', 'abstain');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  password_salt VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  token VARCHAR(255) NOT NULL UNIQUE,
  used_at TIMESTAMP,
  is_valid BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE polls (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  poll_id INTEGER NOT NULL REFERENCES polls(id),
  vote_type vote_type NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_poll_id FOREIGN KEY (poll_id) REFERENCES polls(id)
);

CREATE TABLE parties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE party_affiliations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  party_id INTEGER REFERENCES parties(id),
  is_member BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Write me a postgres query that selects the number of electorial votes and popular votes for a given poll grouped by party id (including unaffiliated) and vote type (yea/nay). Popular votes are the votes cast directly by users. If the user did not cast a vote in a given poll and is affiliated with a party, his vote should be counted towards electorial votes with a yea/nay ratio equal to the ratio between yea/nay votes of that party members (please note it will be a fractional number). Think step by step and ask any follow up questions if needed.

WITH
end_time AS (
  SELECT
    polls.end_time AS end_time
  FROM
    polls
  WHERE
    polls.id = $1
),
current_party_affiliations AS (
  SELECT DISTINCT ON (party_affiliations.user_id)
    party_affiliations.user_id AS user_id,
    party_affiliations.party_id AS party_id,
    party_affiliations.is_member AS is_member
  FROM
    party_affiliations
  INNER JOIN
    end_time ON end_time.end_time >= party_affiliations.created_at
  ORDER BY
    party_affiliations.user_id,
    party_affiliations.created_at DESC
),
all_votes AS (
  SELECT DISTINCT ON (votes.user_id)
    votes.vote_type AS vote_type,
    current_party_affiliations.party_id AS party_id,
    current_party_affiliations.is_member AS is_member
  FROM
    votes
  LEFT JOIN
    current_party_affiliations ON current_party_affiliations.user_id = votes.user_id
  WHERE
    votes.poll_id = $1
  ORDER BY
    votes.user_id,
    votes.created_at DESC
),
party_votes AS (
  SELECT
    party_id,
    COUNT(*) FILTER (WHERE vote_type = 'yea') AS yea_votes,
    COUNT(*) FILTER (WHERE vote_type = 'nay') AS nay_votes,
  FROM
    all_votes
  GROUP BY
    party_id
),
electorial_votes AS (
  SELECT
    
)