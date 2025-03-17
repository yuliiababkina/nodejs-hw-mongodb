import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';

import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

const route = Router();

route.get('/', ctrlWrapper(getContactsController));

route.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

route.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

route.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

route.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default route;
