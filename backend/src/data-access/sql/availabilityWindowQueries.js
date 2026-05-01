import * as db from '../../db/db.js';
import { getOrderByParts } from './helpers/commonQueryHelpers.js';

const WINDOW_SORT_COLUMNS = {
  startTime: 'start_time',
  createdAt: 'created_at',
};

export async function listActiveWindowsByResourceId(resourceId, filters) {
  const { limit, offset, sortBy, sortDirection } = filters;

  const { orderByColumn, direction } = getOrderByParts({
    sortBy,
    sortDirection,
    allowList: WINDOW_SORT_COLUMNS,
  });

  // filters out soft deleted and expired windows (end_time > NOW())
  const sql = `
    SELECT
      id,
      resource_id,
      start_time,
      end_time,
      cancellation_notice_minutes,
      created_at,
      updated_at
    FROM availability_windows
    WHERE resource_id = $1
      AND deleted_at IS NULL
      AND end_time > NOW()
    ORDER BY ${orderByColumn} ${direction}, id DESC
    LIMIT $2
    OFFSET $3
  `;

  const result = await db.query(sql, [resourceId, limit, offset]);

  return result.rows;
}

export async function countActiveWindowsByResourceId(resourceId) {
  const sql = `
    SELECT
      COUNT(*)::int AS total
    FROM availability_windows
    WHERE resource_id = $1
      AND deleted_at IS NULL
      AND end_time > NOW()
  `;

  const result = await db.query(sql, [resourceId]);

  return result.rows[0].total;
}

export async function getDurationsByWindowId(windowId) {
  const sql = `
    SELECT duration_minutes
    FROM availability_window_allowed_durations
    WHERE availability_window_id = $1
    ORDER BY duration_minutes ASC
  `;

  const result = await db.query(sql, [windowId]);

  return result.rows.map((row) => row.duration_minutes);
}
