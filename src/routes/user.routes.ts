import Express from 'express';
export const userRouter = Express.Router();
import { UserController } from '../controllers/user.controller'
const usrController = new UserController()

userRouter.post('/', usrController.getTotalUsers)
userRouter.post('/monthly', usrController.usersVsMonth)
userRouter.post('/unique', usrController.uniqueVisitors)
userRouter.post('/unique-returning', usrController.uniqueVsReturningVisitors)


