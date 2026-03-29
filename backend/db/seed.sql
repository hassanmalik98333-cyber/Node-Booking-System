-- the workflow is to reset the schema (reset.sql) and re-seed so I do not need ON CONFLICT...

-- ==========================================================================
-- SEED REQUIREMENT MAP
-- ==========================================================================
-- [REQ 01] Create one admin user
-- [REQ 02] Create two normal users that are resource owners
-- [REQ 03] Create two normal users that are non-resource owners that will have reservations
-- [REQ 04] Create one normal user with no resources and no reservations
-- [REQ 05] Create at least two active resources
-- [REQ 06] Create at least one inactive resource
-- [REQ 07] Ensure each resource-owner normal user owns at least one resource
-- [REQ 08] Create multiple availability windows across at least two dates
-- [REQ 09] Create two active reservations where the reserver is not the resource owner
-- [REQ 10] Create at least one cancelled reservation
-- [REQ 11] Create at least one completed reservation
-- [REQ 12] Create one reservation where the resource owner reserves their own resource
-- [REQ 13] Create an active resource with no availability windows
-- [REQ 14] Create a resource with no reservations yet
-- [REQ 15] Create one more reservation on the same resource / date but with a different status
-- [REQ 16] Create a resource owned by one user with multiple availability windows on the same date

-----------------
-- users table
-----------------
-- admin user
INSERT INTO users (email, role)
VALUES ('admin@dev.com', 'admin'); -- [REQ 01]

-- normal users
INSERT INTO users (email, role)
VALUES 
  ('hassan@dev.com', 'user'), -- resource owner [REQ 02]
  ('zain@dev.com', 'user'), -- resource owner [REQ 02]
  ('abid@dev.com', 'user'), -- non-resource owner [REQ 03]
  ('humera@dev.com', 'user'), -- non-resource owner [REQ 03]
  ('aisha@dev.com', 'user'); -- non-resource owner + has no reservations [REQ 04]

--------------------
-- resources table
--------------------
INSERT INTO resources (owner_id, name, description, capacity, is_active)
VALUES
  (
    (SELECT id FROM users WHERE (email = 'hassan@dev.com') AND (deleted_at IS NULL)),
    'Meeting Room 1',
    'Medium sized dedicated office room for meetings',
    12,
    TRUE
  ), -- [REQ 05] [REQ 07]
  (
    (SELECT id FROM users WHERE (email = 'zain@dev.com') AND (deleted_at IS NULL)),
    'Meeting Room 2',
    'Small dedicated office room for meetings',
    8,
    TRUE
  ), -- [REQ 05] [REQ 07]
  (
    (SELECT id FROM users WHERE (email = 'zain@dev.com') AND (deleted_at IS NULL)),
    'Soccer Field',
    'average size soccer field',
    26,
    TRUE
  ), -- [REQ 05] [REQ 16]
  (
     (SELECT id FROM users WHERE (email = 'hassan@dev.com') AND (deleted_at IS NULL)),
     'Gym',
     'large room to workout',
     30,
     FALSE
  ), -- [REQ 06]
  (
     (SELECT id FROM users WHERE (email = 'zain@dev.com') AND (deleted_at IS NULL)),
     'Basket Ball Court',
     'An average sized basket ball court',
     12,
     TRUE
  ), -- active with no availability windows [REQ 05] [REQ 13]
  (
     (SELECT id FROM users WHERE (email = 'hassan@dev.com') AND (deleted_at IS NULL)),
     'Tennis Court',
     'Average size tennis court',
     9,
     TRUE
  ); -- a resource with no reservations yet (but has availability windows) [REQ 05] [REQ 14]
-- can test soft deleted resources in the backend client side since (and make sure the client cannot created an already deleted resource with backend logic)

-- used AND (deleted_at IS NULL) to avoid soft deleted users since the email can be used again after soft deletion.

-------------------------------
-- availability_windows table
-------------------------------
INSERT INTO availability_windows (resource_id, start_time, end_time)
VALUES 
  (
    (
      SELECT id FROM resources 
      WHERE 
        (owner_id = (SELECT id FROM users WHERE (email = 'hassan@dev.com') AND (deleted_at IS NULL)))
       AND (name = 'Meeting Room 1') 
       AND (deleted_at IS NULL) -- because I plan on adding a rule which states that an owner cannot "an owner cannot have two resources with the same name if both are non-soft-deleted".
    ),
    '2026-03-24T9:00:00Z',
    '2026-03-24T17:00:00Z'
  ), -- supports [REQ 08]
  (
    (
      SELECT id FROM resources 
      WHERE 
        (owner_id = (SELECT id FROM users WHERE (email = 'hassan@dev.com') AND (deleted_at IS NULL)))
       AND (name = 'Meeting Room 1')
       AND (deleted_at IS NULL)
    ),
    '2026-03-25T9:00:00Z',
    '2026-03-25T17:00:00Z'
  ), -- supports [REQ 08]
  (
    (
      SELECT id FROM resources 
      WHERE 
        (owner_id = (SELECT id FROM users WHERE (email = 'zain@dev.com') AND (deleted_at IS NULL)))
       AND (name = 'Meeting Room 2') 
       AND (deleted_at IS NULL)
    ),
    '2026-03-17T9:00:00Z',
    '2026-03-17T17:00:00Z'
  ), -- supports [REQ 08]
  (
    (
      SELECT id FROM resources 
      WHERE 
        (owner_id = (SELECT id FROM users WHERE (email = 'zain@dev.com') AND (deleted_at IS NULL)))
       AND (name = 'Meeting Room 2') 
       AND (deleted_at IS NULL)
    ),
    '2026-03-18T9:00:00Z',
    '2026-03-18T17:00:00Z'
  ), -- supports [REQ 08]
  (
    (
      SELECT id FROM resources 
      WHERE 
        (owner_id = (SELECT id FROM users WHERE (email = 'hassan@dev.com') AND (deleted_at IS NULL)))
       AND (name = 'Tennis Court') 
       AND (deleted_at IS NULL) 
    ),
    '2026-03-29T11:00:00Z',
    '2026-03-29T17:00:00Z'
  ), -- availability window with no reservation; supports [REQ 14]
  (
    (
      SELECT id FROM resources 
      WHERE 
        (owner_id = (SELECT id FROM users WHERE (email = 'zain@dev.com') AND (deleted_at IS NULL)))
       AND (name = 'Soccer Field') 
       AND (deleted_at IS NULL)
    ),
    '2026-03-17T11:00:00Z',
    '2026-03-17T15:00:00Z'
  ), -- one resource with multiple availability windows in the same day/night (1); supports [REQ 08] [REQ 16]
  (
    (
      SELECT id FROM resources 
      WHERE 
        (owner_id = (SELECT id FROM users WHERE (email = 'zain@dev.com') AND (deleted_at IS NULL)))
       AND (name = 'Soccer Field') 
       AND (deleted_at IS NULL)
    ),
    '2026-03-17T16:00:00Z',
    '2026-03-17T20:00:00Z'
  ); -- one resource with multiple availability windows in the same day/night (2); supports [REQ 08] [REQ 16]

  
-----------------------
-- reservations table
-----------------------
INSERT INTO reservations (resource_id, user_id, start_time, end_time, status, cancelled_at)
VALUES
  (
    (
      SELECT id FROM resources 
      WHERE 
        (owner_id = (SELECT id FROM users WHERE (email = 'hassan@dev.com') AND (deleted_at IS NULL)))
       AND (name = 'Meeting Room 1')
       AND (deleted_at IS NULL) 
    ),
    (SELECT id FROM users WHERE (email = 'abid@dev.com') AND (deleted_at IS NULL)), 
    '2026-03-24T10:00:00Z',
    '2026-03-24T11:00:00Z',
    'active',
    NULL
  ), -- [REQ 09]
  (
    (
      SELECT id FROM resources 
      WHERE 
        (owner_id = (SELECT id FROM users WHERE (email = 'hassan@dev.com') AND (deleted_at IS NULL)))
       AND (name = 'Meeting Room 1')
       AND (deleted_at IS NULL) 
    ),
    (SELECT id FROM users WHERE (email = 'humera@dev.com') AND (deleted_at IS NULL)), 
    '2026-03-24T12:00:00Z',
    '2026-03-24T12:30:00Z',
    'cancelled',
    '2026-03-23T9:00:00Z'
  ), -- reservation on the same resource/date (from above) but with a different status; satisfies [REQ 10] and supports [REQ 15]
  (
    (
      SELECT id FROM resources 
      WHERE 
        (owner_id = (SELECT id FROM users WHERE (email = 'zain@dev.com') AND (deleted_at IS NULL)))
       AND (name = 'Meeting Room 2') 
       AND (deleted_at IS NULL)
    ),
    (SELECT id FROM users WHERE (email = 'humera@dev.com') AND (deleted_at IS NULL)),
    '2026-03-17T12:00:00Z',
    '2026-03-17T12:30:00Z',
    'active',
    NULL
  ), -- [REQ 09]
  (
    (
      SELECT id FROM resources 
      WHERE 
        (owner_id = (SELECT id FROM users WHERE (email = 'hassan@dev.com') AND (deleted_at IS NULL)))
       AND (name = 'Meeting Room 1') 
       AND (deleted_at IS NULL)
    ),
    (SELECT id FROM users WHERE (email = 'humera@dev.com') AND (deleted_at IS NULL)),
   '2026-03-25T11:00:00Z',
    '2026-03-25T11:30:00Z',
    'cancelled',
    '2026-03-24T10:34:24Z'
  ), -- [REQ 10]
  (
    (
      SELECT id FROM resources 
      WHERE 
        (owner_id = (SELECT id FROM users WHERE (email = 'zain@dev.com') AND (deleted_at IS NULL)))
       AND (name = 'Meeting Room 2') 
       AND (deleted_at IS NULL)
    ),
    (SELECT id FROM users WHERE (email = 'humera@dev.com') AND (deleted_at IS NULL)),
    '2026-03-18T10:00:00Z',
    '2026-03-18T10:30:00Z',
    'completed',
    NULL
  ), -- [REQ 11]
  (
    (
      SELECT id FROM resources 
      WHERE 
        (owner_id = (SELECT id FROM users WHERE (email = 'hassan@dev.com') AND (deleted_at IS NULL)))
       AND (name = 'Meeting Room 1') 
       AND (deleted_at IS NULL)
    ),
    (SELECT id FROM users WHERE (email = 'hassan@dev.com') AND (deleted_at IS NULL)),
    '2026-03-24T14:00:00Z',
    '2026-03-24T14:30:00Z',
    'active',
    NULL
  ); -- [REQ 12]
