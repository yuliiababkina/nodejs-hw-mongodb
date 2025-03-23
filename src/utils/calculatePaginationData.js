export const calculatePaginationData = (contactsCount, page, perPage) => {
  const totalPages = Math.ceil(contactsCount / perPage);
  const hasPreviousPage = page !== 1;
  const hasNextPage = Boolean(page < totalPages);

  return {
    page,
    perPage,
    totalItems: contactsCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};
