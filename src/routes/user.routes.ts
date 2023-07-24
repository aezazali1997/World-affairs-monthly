import Express from 'express';
export const userRouter = Express.Router();
import { UserController } from '../controllers/user.controller'

userRouter.get('/', UserController.getTotalUsers)
userRouter.get('/monthly', UserController.usersVsMonth)
userRouter.get('/unique', UserController.uniqueVisitors)
userRouter.get('/unique-returning', UserController.uniqueVsReturningVisitors)


