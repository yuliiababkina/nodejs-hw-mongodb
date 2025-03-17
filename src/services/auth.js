import bcrypt from 'bcrypt';

import { UserCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';

export const registerUser = async (userData) => {
  const user = await UserCollection.findOne({ email: userData.email });

  if (user) {
    throw createHttpError(409, 'Email in uses');
  }

  const encryptedPassword = await bcrypt.hash(userData.password, 10);
  return await UserCollection.create({
    ...userData,
    password: encryptedPassword,
  });
};
