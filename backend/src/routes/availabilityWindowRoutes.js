import { Router } from 'express';
import * as availabilityWindowController from '../controllers/availabilityWindowController.js';
import validateRequest from '../middleware/validateRequest.js';
import {
  listAvailabilityWindowsQuerySchema,
  getAvailabilityWindowByIdParamsSchema,
} from '../validators/availabilityWindowSchemas.js';
import requireRole from '../middleware/requireRole.js';
import requireAuth from '../middleware/requireAuth.js';
import loadCurrentStateOfAuthUser from '../middleware/loadCurrentStateOfAuthUser.js';

const availabilityWindowsRouter = Router();

availabilityWindowsRouter.get(
  '/',
  requireAuth,
  loadCurrentStateOfAuthUser,
  requireRole(['employee', 'admin']),
  validateRequest({
    query: {
      schema: listAvailabilityWindowsQuerySchema,
      errorMessage: 'Invalid availability window list query.',
    },
  }),
  availabilityWindowController.listAvailabilityWindows,
);

availabilityWindowsRouter.get(
  '/:availabilityWindowId',
  requireAuth,
  loadCurrentStateOfAuthUser,
  requireRole(['employee', 'admin']),
  validateRequest({
    params: {
      schema: getAvailabilityWindowByIdParamsSchema,
      errorMessage: 'Invalid availability window id parameter.',
    },
  }),
  availabilityWindowController.getAvailabilityWindowById,
);

export default availabilityWindowsRouter;
