-- psql -U postgres -h 127.0.0.1 -d liquid_democracy -f .../liquid-democracy/database/populate.sql
INSERT INTO
  users (name, password, password_salt)
VALUES
  ('Alice', 'dc90cf07de907ccc64636ceddb38e552a1a0d984743b1f36a447b73877012c39', 'salt1'),
  ('Bob', 'dbc4579ae2b3ab293213f42bb852706ea995c3b5c3987f8aa9faae5004acb3cf', 'salt2'),
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

INSERT INTO
  parties (name, color)
VALUES
  ('Nice Party', 'red'),
  ('Super Party', 'blue'),
  ('Awesome Party', 'green'),
  ('Cool Party', 'yellow'),
  ('Great Party', 'purple');