import { SORT_ORDER } from '../constants/index.js';

const parseSortOrder = (sortOrder) => {
  const isKnownSortOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(
    sortOrder,
  );
  if (isKnownSortOrder) return sortOrder;

  return SORT_ORDER.ASC;
};

// const parseSortBy = (sortBy) => {
//   const keysOfContact = [
//     '_id',
//     'name',
//     'phoneNumber',
//     'email',
//     'isFavourite',
//     'contactType',
//     'createdAt',
//     'updatedAt',
//   ];

//   if (keysOfContact.includes(sortBy)) {
//     return sortBy;
//   }

//   return 'name';
// };

export const parseSortParams = (query) => {
  const { sortOrder } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  //   const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: 'name',
  };
};
