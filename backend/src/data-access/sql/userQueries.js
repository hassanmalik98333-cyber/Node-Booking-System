import * as db from '../../db/db.js';
import { buildActiveUsersWhereClause } from './helpers/userQueryHelpers.js';
import { getOrderByParts } from './helpers/commonQueryHelpers.js';

const USER_SORT_COLUMNS = {
  createdAt: 'created_at',
  username: 'username',
  email: 'email',
  role: 'role',
}; // enum style allow list for sortBy API to SQL conversion

export async function listActiveUsers(filters) {
  const { limit, offset, role, search, sortBy, sortDirection } = filters;
  // destructures the validated/defaulted filter object
  // for this length, I prefer destructuring it outside of the parameters

  const { values, whereClause } = buildActiveUsersWhereClause({ role, search });

  const { orderByColumn, direction } = getOrderByParts({
    sortBy,
    sortDirection,
    allowList: USER_SORT_COLUMNS,
  });

  values.push(limit); // limit(pageSize) and offset are either client values or defaults from validation
  const limitPlaceholder = `$${values.length}`;

  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const sql = `
    SELECT
      id,
      username,
      name,
      email,
      role,
      created_at,
      updated_at
    FROM users
    WHERE ${whereClause}
    ORDER BY ${orderByColumn} ${direction}, id DESC
    LIMIT ${limitPlaceholder}
    OFFSET ${offsetPlaceholder}
  `;

  const result = await db.query(sql, values);

  return result.rows;
} // for  GET '/api/users'

// ex or GET request:
// GET /api/users?page=1&pageSize=10&role=user&search=ali&sortBy=createdAt&sortDirection=desc

export async function countActiveUsers(filters) {
  const { role, search } = filters;
  // just to make it consistent,
  // it could easily go in the parameters instead

  const { values, whereClause } = buildActiveUsersWhereClause({ role, search });

  const sql = `
    SELECT
      COUNT(*)::int AS total
    FROM users
    WHERE ${whereClause}
  `;
  // COUNT(*) returns bigint which can possibly go higher than the js max number storage,
  // so without ::int the total may come back as a string instead of a number.

  // :: is the cast operator, ::int converts COUNT(*) into int
  // it is short for CAST(COUNT(*) AS int)

  const result = await db.query(sql, values);

  return result.rows[0].total;
} // this function is for pagination info for '/api/users'

export async function getActiveUserById(userId) {
  const sql = `
    SELECT 
      id,
      username,
      name,
      email,
      role,
      created_at,
      updated_at
    FROM users
    WHERE id = $1
      AND deleted_at IS NULL
  `;

  const result = await db.query(sql, [userId]);

  return result.rows[0] ?? null;
} // for  GET '/api/users/:userId'

export async function createUser(userData) {
  const { username, name, email, role } = userData;

  const sql = `
    INSERT INTO users (username, name, email, role)
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      username,
      name,
      email,
      role,
      created_at,
      updated_at
  `;

  const result = await db.query(sql, [username, name ?? null, email, role]);
  // use the ?? pattern with other nullable columns
  // When js null is passed through pg, it becomes SQL NULL.

  return result.rows[0];
} // for POST '/api/users'

export async function updateUser(userData) {
  const { userId, username, name, email } = userData;

  const columns = [];
  const values = [];

  values.push(userId);

  const userIdPlaceHolder = `$${values.length}`;

  if (username !== undefined) {
    values.push(username);
    columns.push(`username = $${values.length}`);
  }

  if (name !== undefined) {
    values.push(name);
    columns.push(`name = $${values.length}`);
  }

  if (email !== undefined) {
    values.push(email);
    columns.push(`email = $${values.length}`);
  }

  const setClause = columns.join(', '); // the space is there for error logging readability purposes

  const sql = `
    UPDATE users
    SET ${setClause}
    WHERE id = ${userIdPlaceHolder}
      AND deleted_at IS NULL
    RETURNING
      id,
      username,
      name,
      email,
      role,
      created_at,
      updated_at
  `;

  const result = await db.query(sql, values);

  return result.rows[0];
}
// updating role is deferred to step 8
