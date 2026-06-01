import { Router } from 'express';
import authRouter from './authRoutes.js';
import meRouter from './meRoutes.js';
import resourcesRouter from './resourceRoutes.js';
import availabilityWindowsRouter from './availabilityWindowRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/me', meRouter);
apiRouter.use('/resources', resourcesRouter);
apiRouter.use('/availability-windows', availabilityWindowsRouter);

export default apiRouter;
