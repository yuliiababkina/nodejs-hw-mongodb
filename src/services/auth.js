import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';

import { usersCollection } from '../db/models/user.js';
import { sessionsCollection } from '../db/models/session.js';
import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} from '../constants/index.js';

export const registerUser = async (payload) => {
  const user = await usersCollection.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'Email in uses');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return await usersCollection.create(payload);
};

export const loginUser = async (payload) => {
  const user = await usersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isPwdEqual = await bcrypt.compare(payload.password, user.password);

  if (!isPwdEqual) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  await sessionsCollection.deleteOne({ userId: user._id });

  const session = await sessionsCollection.create({
    userId: user._id,
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });
  return session;
};

export const logoutUser = async ({ refreshToken }) => {
  await sessionsCollection.deleteOne({ refreshToken });
};

// const createSession = () => {
//   const accessToken = randomBytes(30).toString('base64');
//   const refreshToken = randomBytes(30).toString('base64');

//   return {
//     accessToken,
//     refreshToken,
//     accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
//     refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
//   };
// };

// export const refreshUsersSession = async (sessionId, refreshToken) => {
//   const session = await sessionsCollection.findOne({
//     _id: sessionId,
//     refreshToken,
//   });

//   if (!session) {
//     throw createHttpError(401, 'Session not found');
//   }

//   const isSessionTokenExpired =
//     new Date() > new Date(session.refreshTokenValidUntil);

//   if (isSessionTokenExpired) {
//     throw createHttpError(401, 'Session token expired');
//   }

//   const newSession = createSession();

//   await sessionsCollection.deleteOne({ _id: sessionId, refreshToken });

//   return await SessionsCollection.create({
//     userId: session.userId,
//     ...newSession,
//   });
// };
