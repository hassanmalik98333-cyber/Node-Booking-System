import pg from 'pg';
import config from '../config/index.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
});

pool.on('error', (error) => {
  console.error('Unexpected postgreSQL pool error:', error);
});
// catches errors on idle pooled connections.
// does not handle normal query errors,
// those are handled where db.query is called
