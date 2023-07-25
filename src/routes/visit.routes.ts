import Express from "express";
import { VisitController } from '../controllers/visit.controller'
export const VisitRouter = Express.Router();
const visitController = new VisitController();
VisitRouter.post('/', visitController.get24HourVisitList);