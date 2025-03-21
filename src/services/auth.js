import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { usersCollection } from '../db/models/user.js';
import { sessionsCollection } from '../db/models/session.js';

import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} from '../constants/index.js';

const createSession = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
  refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
});

export const registerUser = async (payload) => {
  const user = await usersCollection.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return await usersCollection.create(payload);
};

export const loginUser = async (payload) => {
  const user = await usersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, 'User is not found');
  }

  const isPwdEqual = await bcrypt.compare(payload.password, user.password);

  if (!isPwdEqual) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  await sessionsCollection.deleteOne({ userId: user._id });

  const session = await sessionsCollection.create({
    ...createSession(),
    userId: user._id,
  });

  return session;
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await sessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session is not found');
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Session token has expired');
  }

  const user = await usersCollection.findById(session.userId);

  if (!user) {
    throw createHttpError(401, 'Session user is not found');
  }

  await sessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  const newSession = await sessionsCollection.create({
    ...createSession(),
    userId: session.userId,
  });

  return newSession;
};

export const logoutUser = async (sessionId) => {
  await sessionsCollection.deleteOne({ _id: sessionId });
  return undefined;
};
