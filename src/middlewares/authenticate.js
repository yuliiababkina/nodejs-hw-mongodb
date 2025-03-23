import createHttpError from 'http-errors';
import { sessionsCollection } from '../db/models/session.js';
import { usersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const [bearer, token] = authHeader.split(' ', 2);

  if (bearer !== 'Bearer') {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  if (!token) {
    next(createHttpError(401, 'Access token is not provided'));
    return;
  }

  const session = await sessionsCollection.findOne({ accessToken: token });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    next(createHttpError(401, 'Access token expired'));
  }

  const user = await usersCollection.findById(session.userId);

  if (!user) {
    next(createHttpError(401, 'User is not found'));
    return;
  }

  req.user = user;

  next();
};
