import { SORT_ORDER } from '../constants/index.js';
import { contactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy,
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactQuery = contactsCollection.find({ userId });

  if (filter.type) {
    contactQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    contactsCollection.find().merge(contactQuery).countDocuments(),
    contactQuery
      .limit(limit)
      .skip(skip)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return { data: contacts, ...paginationData };
};

export const getContactById = async (contactId, userId) => {
  const contact = await contactsCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (payload) => {
  const contact = contactsCollection.create(payload);
  return contact;
};

export const updateContact = async (
  contactId,
  payload,
  userId,
  options = {},
) => {
  const result = await contactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  return result.value;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await contactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};
