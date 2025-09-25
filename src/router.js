import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mainRouter from './routes/mainRouter.js';
import attachUserData from './middleware/attachUserData.js';

const router = express.Router();

let corsOptions = {
  credentials: true,
  origin: true,
};

router.use(cors(corsOptions));

router.use(morgan('tiny'));

router.use(express.json({ limit: '5mb' }));
router.use(express.urlencoded({ limit: '5mb', extended: true }));

//Logout should be above auth, so that invalid user can logout

router.use(attachUserData);

router.use(mainRouter);

export default router;
