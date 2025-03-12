const parseContactType = (type) => {
  if (typeof type !== 'string') return null;
  const isValidType = (type) =>
    ['work', 'home', 'personal'].includes(type.toLowerCase());

  if (isValidType(type)) return type;
};

const parseIsFavourite = (value) => {
  if (typeof value === 'boolean') return value;

  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedContactType = parseContactType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
