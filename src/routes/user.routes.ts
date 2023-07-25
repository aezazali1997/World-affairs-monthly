import Express from 'express';
export const userRouter = Express.Router();
import { UserController } from '../controllers/user.controller'
const usrController = new UserController()

userRouter.get('/', usrController.getTotalUsers)
userRouter.get('/monthly', usrController.usersVsMonth)
userRouter.get('/unique', usrController.uniqueVisitors)
userRouter.get('/unique-returning', usrController.uniqueVsReturningVisitors)


