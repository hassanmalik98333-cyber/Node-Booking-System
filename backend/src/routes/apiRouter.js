import { Router } from 'express';

import userRouter from './userRoutes.js';
import resourceRouter from './resourceRoutes.js';

const apiRouter = Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/resources', resourceRouter);

export default apiRouter;
