-- FOR DEVELOPMENT
-- Rebuilds the development database 
-- run in psql in the backend folder not the db folder


\set ON_ERROR_STOP on 

BEGIN;

\i db/dev/reset.sql
\i db/schema.sql

\i db/seeds/01-users.sql
\i db/seeds/02-resources.sql
\i db/seeds/03-availability-windows.sql
\i db/seeds/04-availability-window-allowed-durations.sql
\i db/seeds/05-reservations.sql

\i db/functions.sql
\i db/triggers.sql

COMMIT;