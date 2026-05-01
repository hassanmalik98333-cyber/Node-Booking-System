export function getOrderByParts({ sortBy, sortDirection, allowList }) {
  const direction = sortDirection === 'asc' ? 'ASC' : 'DESC';

  const orderByColumn = allowList[sortBy];

  return {
    orderByColumn,
    direction,
  };
}
