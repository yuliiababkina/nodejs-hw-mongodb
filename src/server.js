import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { getEnvVar } from './utils/getEnvVar.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();
  app.use(express.json());

  app.use(
    pino({
      level: 'silent',
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());
  app.use(cookieParser());

  app.use((req, res, next) => {
    req.log.info({
      time: new Date().toLocaleString(),
      url: req.url,
      method: req.method,
      ip: req.ip,
    });
    next();
  });

  app.use(router);

  app.use('*', notFoundHandler);
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
