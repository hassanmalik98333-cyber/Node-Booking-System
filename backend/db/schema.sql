CREATE TABLE users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ, -- make it so that a soft deleted user cannot be un-deleted (backend logic in step 5)
  -- TIMESTAMPTZ NOT NULL DEFAULT NOW() does not automatically make it UTC, you have to make it TC by stting it in the current session, the database, and the role/user.
  -- PostgreSQL stores it internally in a UTC-based form, The part that changes is mostly display/output, which follows the session timezone. 
  CONSTRAINT user_role_check CHECK (role IN ('user', 'admin'))
);

CREATE UNIQUE INDEX unique_email_for_non_deleted_user_idx 
ON users (lower(email))
WHERE deleted_at IS NULL;
  -- partial unique index
  -- this is used so that email is only unique if it is not soft deleted, as soon as it is soft deleted, it is no longer unique
  -- this is good because if a user gets soft-deleted, another user can be created using that email

-- with backend logic (or a trigger) enforce that a user cannot be hard deleted.

-- with backend logic make it so that a soft deleted user cannot creat more resources, or more reservations
-- also make it so that all active reservations for the soft deleted user become cancelled and the resources owned by that soft deleted user also become soft deleted.

CREATE TABLE resources (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ, -- make it so that a soft deleted resource cannot be un-deleted (backend logic in step 5)

  CONSTRAINT resources_owner_id_fkey
    FOREIGN KEY (owner_id)
    REFERENCES users(id)
    ON DELETE RESTRICT,

  CONSTRAINT resource_capacity_check
    CHECK (capacity > 0),
  
  CONSTRAINT valid_is_active_deleted_at_check
    CHECK ( 
         (is_active = TRUE AND deleted_at IS NULL) 
      OR (is_active = FALSE AND deleted_at IS NULL) 
      OR (is_active = FALSE AND deleted_at IS NOT NULL) 
    )
      -- active + deleted is not allowed
      -- can enforce in the backend that deleting a resource automatically makes it in-active and can never become active again
        -- can also do it with triggers
);
-- can enforce backend logic to prevent hard deletion of a resource that has no availability_window pointing to is due to is_active being false (can also do it in the database with triggers, but I dont know that yet)
-- it is also realistic for someone to make a resource as inactive initially so it begins with no availability_window pointing to it.
-- can also make it so that if is_active goes from false to true, that it makes availability windows 
-- can make it so that if it goes from true to false, that the availability_windows are deleted
  -- both of these can be enforced in the backend code.
-- If a resource is deactivated, all availability windows should remain to keep hard delete enforcement (can further enforce in the db level or backend as well). But when reactivated the old activity windows must be removed and replaced with new ones. 

-- can also enforce in the backend logic that once a resource is deleted, it can never become active again.

-- The backend can enforce that one owner cannot have more than one of the same resource name unless all the resources with that name belonging to that owner are soft deleted, only then can the owner make the resource again. But if the resource with that name exists in the resource table and it is not soft deleted, then it is blocked.
  -- This can be enforce in the backend in the step 5 implementation.

CREATE TABLE availability_windows (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  resource_id INTEGER NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 

  CONSTRAINT  valid_availability_window_check
    CHECK (end_time > start_time),

  CONSTRAINT unique_resource_availability_window
    UNIQUE (resource_id, start_time, end_time),
    -- solves duplicate time slots per resource_id but not time slot overlap (this is an s tier feature that starts at step 5)

  CONSTRAINT availability_windows_resource_id_fkey
    FOREIGN KEY (resource_id)
    REFERENCES resources(id)
    ON DELETE RESTRICT
);
-- ON DELETE RESTRICT is here as a gaurd against hard deleting a resource (resources are only to be soft deleted)
-- As long as the resource_id points to the resource, hard deleting the resource is impossible in the database level (even without backend logic).
-- this does not prevent someone from seeding a resource that is already deleted. This can be enforced in the backend but I dont know how to do so in the database (to prevent someone from seeding it directly in the database).
-- I will just not account for the extreme case of someone seeding an already deleted resource directly in the database, just can do so in the backend to prevent clients from doing that.
-- Do not not seed it, just test it client side.
-- can also solve this with trigger

-- with backend logic first an with trigger as a gaurd make it so that inactive or soft-deleted resources cannot receive new availability windows

CREATE TABLE reservations (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  resource_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- add logic to make it so that once a reservation is cancelled, it cannot be un-cancelled (backend)
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_reservation_time_check
    CHECK (end_time > start_time), 

  CONSTRAINT reservation_status_check
    CHECK (status IN ('active', 'cancelled', 'completed')),

  CONSTRAINT valid_status_cancelled_at_check
    CHECK (
         (status = 'cancelled' AND cancelled_at IS NOT NULL)
      OR (status = 'active' AND cancelled_at IS NULL)
      OR (status = 'completed' AND cancelled_at IS NULL)
    ),
  
  CONSTRAINT reservations_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE RESTRICT,

  CONSTRAINT reservations_resource_id_fkey
    FOREIGN KEY (resource_id)
    REFERENCES resources(id)
    ON DELETE RESTRICT
);
-- can add logic in the backend that so that reservations are only valid if they fall inside the resource availability window.
-- with trigger + backend logic enforce that inactive or soft-deleted resources cannot receive new reservations

-- indexes to start with before backend database logic is even written (may change later)
CREATE INDEX idx_resources_owner_id ON resources(owner_id);
CREATE INDEX idx_resources_is_active ON resources(is_active);
CREATE INDEX idx_resources_deleted_at ON resources(deleted_at);

CREATE INDEX idx_availability_resource_start 
  ON availability_windows(resource_id, start_time);
  -- even though this creates an index on the combonation, it may still be used for resource_id as it is the first column.

CREATE INDEX idx_reservations_user_created 
  ON reservations(user_id, created_at);
CREATE INDEX idx_reservations_resource_start 
  ON reservations(resource_id, start_time);
CREATE INDEX idx_reservations_status ON reservations(status);

-- remember updated_at for all the tables needs to be handles consistently by the backend logic, dont forget this

-- remember the raw sql schema and prisma schema must stay aligned, they must not drift into different directions.
  -- migrations that help keep them in sync

-- Once a user or resource is soft deleted, it cannot be restored. However, a new user may still be created with the same email after the previous user is soft deleted, and a resource owner may still create a new resource with the same name after all of their resources with that name have been soft deleted. These rules are enforced in the backend.

----
-- original step 5 rules wording
----
-- add logic in the backend that so that reservations are only valid if they fall inside the resource availability window
-- The backend can enforce that one owner cannot have more than one of the same resource name unless all the resources with that name belonging to that owner are soft deleted, only then can the owner make the resource again. But if the resource with that name belonging to that owner exists in the resource table and it is not soft deleted, then it is blocked.
-- Test both self-booking and non-self-booking reservation scenarios 
-- reservation-user vs resource-owner relationship testing 
