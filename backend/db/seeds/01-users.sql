INSERT INTO users (username, name, email, role, deleted_at)
VALUES
  ('admin1', 'Hassan', 'admin1@dev.com', 'admin', NULL), -- U1 - admin user
  ('active-owner1', 'Zain', 'zain@dev.com', 'user', NULL), -- U2 - active owner 1
  ('active-owner2', 'Cody', 'cody@dev.com', 'user', NULL), -- U3 - active owner 2
  ('reused-username', 'Zack', 'zack@dev.com', 'user', NULL), -- U4 - acive user with no resources yet, re-uses U8 user name
  ('active-booking-user1', 'Umar', 'umar@dev.com', 'user', NULL), -- U5 - active booking user 1
  ('active-booking-user2', 'Zainab', 'zainab@dev.com', 'user', NULL), -- U6 - active booking user 2
  ('active-blank-user', 'Aisha', 'aisha@dev.com', 'user', NULL), -- U7 - active user with no reservations or resources
  ('reused-username', 'Bob', 'bob@dev.com', 'user', '2026-03-24T9:00:00Z'); -- U8 - soft deleted user 