import Express from "express";
import { VisitController } from '../controllers/visit.controller'
export const VisitRouter = Express.Router();
const visitController = new VisitController();
VisitRouter.get('/', visitController.get24HourVisitList);