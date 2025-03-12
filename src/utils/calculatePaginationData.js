import createHttpError from 'http-errors';

export const calculatePaginationData = (totalItems, page, perPage) => {
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page !== 1;
  const hasNextPage = Boolean(page < totalPages);

  if (page > totalPages) {
    throw createHttpError(400, 'Invalid page number');
  }

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};
