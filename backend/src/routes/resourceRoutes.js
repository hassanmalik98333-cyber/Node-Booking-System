import { Router } from 'express';
import * as resourceController from '../controllers/resourceController.js';

const resourceRouter = Router();

resourceRouter.get('/', resourceController.listActiveResourcesController);
resourceRouter.get('/:resourceId', resourceController.getActiveResourceByIdController)

export default resourceRouter;
