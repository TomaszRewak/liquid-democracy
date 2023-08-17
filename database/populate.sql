-- psql -U postgres -h 127.0.0.1 -d liquid_democracy -f .../liquid-democracy/database/populate.sql
INSERT INTO
  users (name, password, password_salt)
VALUES
  ('Alice', 'dc90cf07de907ccc64636ceddb38e552a1a0d984743b1f36a447b73877012c39', 'salt1'),
  ('Charlie', 'password3', 'salt3'),
  ('Dave', 'password4', 'salt4'),
  ('Eve', 'password5', 'salt5'),
  ('Frank', 'password6', 'salt6'),
  ('Grace', 'password7', 'salt7'),
  ('Heidi', 'password8', 'salt8'),
  ('Ivan', 'password9', 'salt9'),
  ('Judy', 'password10', 'salt10'),
  ('Karen', 'password11', 'salt11'),
  ('Bob', 'dbc4579ae2b3ab293213f42bb852706ea995c3b5c3987f8aa9faae5004acb3cf', 'salt2'),
  ('Liam', 'password12', 'salt12'),
  ('Mia', 'password13', 'salt13'),
  ('Noah', 'password14', 'salt14'),
  ('Olivia', 'password15', 'salt15'),
  ('Penelope', 'password16', 'salt16'),
  ('Quinn', 'password17', 'salt17'),
  ('Riley', 'password18', 'salt18'),
  ('Samantha', 'password19', 'salt19'),
  ('Thomas', 'password20', 'salt20'),
  ('Uma', 'password21', 'salt21'),
  ('Violet', 'password22', 'salt22'),
  ('William', 'password23', 'salt23'),
  ('Xander', 'password24', 'salt24'),
  ('Yara', 'password25', 'salt25'),
  ('Zachary', 'password26', 'salt26'),
  ('Abby', 'password27', 'salt27'),
  ('Benjamin', 'password28', 'salt28'),
  ('Caleb', 'password29', 'salt29'),
  ('Daisy', 'password30', 'salt30'),
  ('Ella', 'password31', 'salt31'),
  ('Finn', 'password32', 'salt32'),
  ('Greta', 'password33', 'salt33'),
  ('Henry', 'password34', 'salt34'),
  ('Isabella', 'password35', 'salt35'),
  ('Jack', 'password36', 'salt36'),
  ('Katie', 'password37', 'salt37'),
  ('Leo', 'password38', 'salt38'),
  ('Maggie', 'password39', 'salt39'),
  ('Nate', 'password40', 'salt40'),
  ('Oliver', 'password41', 'salt41'),
  ('Piper', 'password42', 'salt42'),
  ('Quincy', 'password43', 'salt43'),
  ('Ruby', 'password44', 'salt44'),
  ('Sam', 'password45', 'salt45'),
  ('Tessa', 'password46', 'salt46'),
  ('Ulysses', 'password47', 'salt47'),
  ('Vivian', 'password48', 'salt48'),
  ('Wyatt', 'password49', 'salt49'),
  ('Ximena', 'password50', 'salt50');

INSERT INTO
  polls (name, description, start_time, end_time)
VALUES
  ('Do you like dogs?', 'This poll is about your affinity towards dogs.', NOW() - INTERVAL '1 month', NOW() - INTERVAL '2 weeks'),
  ('Do you prefer summer over winter?', 'This poll is about your preference between summer and winter.', NOW() - INTERVAL '1 month', NOW() - INTERVAL '2 weeks'),
  ('Do you like spicy food?', 'This poll is about your taste for spicy food.', NOW() - INTERVAL '1 month', NOW() - INTERVAL '2 weeks'),
  ('Do you enjoy playing video games?', 'This poll is about your interest in playing video games.', NOW() - INTERVAL '1 month', NOW() - INTERVAL '2 weeks'),
  ('Do you like to travel?', 'This poll is about your interest in traveling.', NOW() - INTERVAL '1 month', NOW() - INTERVAL '2 weeks'),
  ('Do you prefer coffee over tea?', 'This poll is about your preference between coffee and tea.', NOW() - INTERVAL '1 week', NOW() + INTERVAL '10 minutes'),
  ('Do you like to read books?', 'This poll is about your interest in reading books.', NOW() - INTERVAL '1 week', NOW() + INTERVAL '1 hour'),
  ('Do you enjoy watching movies?', 'This poll is about your interest in watching movies.', NOW() - INTERVAL '1 week', NOW() + INTERVAL '1 week'),
  ('Do you like to cook?', 'This poll is about your interest in cooking.', NOW() - INTERVAL '1 week', NOW() + INTERVAL '1 week'),
  ('Do you prefer the beach over the mountains?', 'This poll is about your preference between the beach and the mountains.', NOW() - INTERVAL '1 week', NOW() + INTERVAL '1 week'),
  ('Do you like to exercise?', 'This poll is about your interest in exercising.', NOW() - INTERVAL '1 week', NOW() + INTERVAL '1 week'),
  ('Do you enjoy listening to music?', 'This poll is about your interest in listening to music.', NOW() - INTERVAL '1 week', NOW() + INTERVAL '1 week'),
  ('Do you like to dance?', 'This poll is about your interest in dancing.', NOW() - INTERVAL '1 week', NOW() + INTERVAL '1 week'),
  ('Do you prefer sweet over savory food?', 'This poll is about your preference between sweet and savory food.', NOW() - INTERVAL '1 week', NOW() + INTERVAL '1 week'),
  ('Do you like to play sports?', 'This poll is about your interest in playing sports.', NOW() - INTERVAL '1 week', NOW() + INTERVAL '1 week'),
  ('Do you enjoy going to concerts?', 'This poll is about your interest in going to concerts.', NOW() + INTERVAL '2 months', NOW() + INTERVAL '3 months'),
  ('Do you like to paint or draw?', 'This poll is about your interest in painting or drawing.', NOW() + INTERVAL '2 months', NOW() + INTERVAL '3 months'),
  ('Do you prefer the city over the countryside?', 'This poll is about your preference between the city and the countryside.', NOW() + INTERVAL '2 months', NOW() + INTERVAL '3 months'),
  ('Do you like to sing?', 'This poll is about your interest in singing.', NOW() + INTERVAL '2 months', NOW() + INTERVAL '3 months'),
  ('Do you enjoy going to the theater?', 'This poll is about your interest in going to the theater.', NOW() + INTERVAL '2 months', NOW() + INTERVAL '3 months');

INSERT INTO
  parties (name, color)
VALUES
  ('Super Party', 'blue'),
  ('Cool Party', 'yellow'),
  ('Great Party', 'purple');

INSERT INTO
  party_affiliations (user_id, party_id, is_member)
VALUES
  (1, 3, TRUE),
  (2, 2, TRUE),
  (3, 1, TRUE),
  (4, 1, TRUE),
  (5, 2, TRUE),
  (6, 2, TRUE),
  (7, 3, TRUE),
  (8, 1, TRUE),
  (9, 1, TRUE),
  (10, 2, TRUE),
  (11, 1, FALSE),
  (12, 2, FALSE),
  (13, 3, FALSE),
  (14, 1, FALSE),
  (15, 2, FALSE),
  (16, 1, FALSE),
  (17, 2, FALSE),
  (18, 3, FALSE),
  (19, 1, FALSE),
  (31, 1, FALSE),
  (32, 2, FALSE),
  (33, 3, FALSE),
  (34, 1, FALSE),
  (35, 2, FALSE),
  (36, 1, FALSE),
  (37, 2, FALSE),
  (38, 3, FALSE),
  (39, 2, FALSE),
  (40, 2, FALSE);

  -- Generate random yea/nay votes for each poll and randomly skip half of the votes
INSERT INTO votes (user_id, poll_id, vote_type)
SELECT
  user_id,
  poll_id,
  CASE floor(random() * 5)
    WHEN 0 THEN 'yea'::vote_type
    WHEN 1 THEN 'yea'::vote_type 
    WHEN 2 THEN 'nay'::vote_type
    WHEN 3 THEN 'nay'::vote_type
    ELSE 'abstain'::vote_type
  END AS vote_type
FROM (
  SELECT user_id, poll_id
  FROM (
    SELECT DISTINCT user_id, poll_id
    FROM generate_series(1, 50) AS user_id, generate_series(1, 15) AS poll_id
  ) AS user_poll_combinations
) AS numbered_user_poll_combinations
WHERE floor(random() * 2) = 0;