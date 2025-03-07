import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const route = Router();

route.get('/contacts', ctrlWrapper(getContactsController));

route.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

route.post('/contacts', ctrlWrapper(createContactController));

route.patch('/contacts/:contactId', ctrlWrapper(patchContactController));

route.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default route;
