import express from 'express';
import apiRouter from './apiRouter.js';
import * as dotenv from 'dotenv';

if (!process.env.PORT) dotenv.config();

const router = express.Router();

router.use('/api/v1', apiRouter);

export default router;
