import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';

import { UsersCollection } from '../db/models/user.js';
import { sessionCollection } from '../db/models/session.js';
import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} from '../constants/index.js';

export const registerUser = async (userData) => {
  const user = await UsersCollection.findOne({ email: userData.email });

  if (user) {
    throw createHttpError(409, 'Email in uses');
  }

  const encryptedPassword = await bcrypt.hash(userData.password, 10);
  return await UsersCollection.create({
    ...userData,
    password: encryptedPassword,
  });
};

export const loginUser = async (userData) => {
  const user = await UsersCollection.findOne({ email: userData.email });

  const isPwdEqual = await bcrypt.compare(userData.password, user.password);

  if (!user && isPwdEqual) {
    throw createHttpError(401, 'User not found');
  }

  await sessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await sessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });
};
