import { Router } from 'express';
import * as userController from '../controllers/userController.js';

const userRouter = Router();

userRouter.get('/', userController.listActiveUsersController);
userRouter.get('/:userId', userController.getActiveUserByIdController);
userRouter.post('/', userController.createUserController);
userRouter.patch('/:userId', userController.updateUserController);

export default userRouter;
