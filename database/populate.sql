-- psql -U postgres -h 127.0.0.1 -d liquid_democracy -f .../liquid-democracy/database/populate.sql
INSERT INTO
  users (name, password, password_salt)
VALUES
  ('Alice', 'password1', 'salt1'),
  ('Bob', 'password2', 'salt2'),
  ('Charlie', 'password3', 'salt3'),
  ('Dave', 'password4', 'salt4'),
  ('Eve', 'password5', 'salt5');

INSERT INTO
  polls (name, description)
VALUES
  ('Poll 1', 'Description 1'),
  ('Poll 2', 'Description 2'),
  ('Poll 3', 'Description 3'),
  ('Poll 4', 'Description 4'),
  ('Poll 5', 'Description 5');