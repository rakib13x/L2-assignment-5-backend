/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/middleware';
import router from './app/routes';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());

// app.use(
//   cors({
//     origin: ['https://assignmen-5-client.vercel.app'],
//     credentials: true,
//   }),
// );

const allowedOrigins = [
  'http://localhost:5173',
  'https://assignmen-5-client.vercel.app',
];

app.use(
  cors({
    origin: (origin: string | undefined, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        // Allow request if origin is allowed or origin is undefined (non-browser requests)
        callback(null, true);
      } else {
        // Reject request if origin is not allowed
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

// Handle preflight requests (OPTIONS)
app.options(
  '*',
  cors({
    origin: (origin: string | undefined, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from server.');
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
