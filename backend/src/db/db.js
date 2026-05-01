import { pool } from './pool.js';

export async function query(sql, values = []) {
  return pool.query(sql, values);
}
// values is defaulted to [] to avoid it being undefined in queries that have no placeholders

export async function getClient() {
  return pool.connect();
}
// getClient is clearer and more explicit than connect

// add pool.end() later for testing
