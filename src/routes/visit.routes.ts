import Express from "express";
import { VisitController } from '../controllers/visit.controller'
export const VisitRouter = Express.Router();

VisitRouter.get('/', VisitController.get24HourVisitList);