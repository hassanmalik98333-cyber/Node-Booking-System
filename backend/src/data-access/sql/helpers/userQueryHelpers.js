export function buildActiveUsersWhereClause({ role, search }) {
  const values = [];
  const conditions = ['deleted_at IS NULL'];

  if (role !== undefined) {
    values.push(role);
    conditions.push(`role = $${values.length}`);
  }

  if (search !== undefined) {
    values.push(`%${search}%`);

    const searchPlaceholder = `$${values.length}`;
    conditions.push(`
      (
        username ILIKE ${searchPlaceholder}
        OR email ILIKE ${searchPlaceholder}
      )
    `);
  }

  return { values, whereClause: conditions.join(' AND ') };
}
