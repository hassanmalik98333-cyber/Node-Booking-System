import { Router } from 'express';
import { success, error } from '../utils/response.js';
import BadRequestError from '../errors/badRequest.js';
import errCodes from '../errors/errorCodes.js';

const router = Router();

router.get('/hello', (req, res, next) => {
  return res.json(success({ message: 'api running' }));
});

router.get('/health', (req, res) => {
  return res.json(success({ service: 'alive' }));
});

export default router;

