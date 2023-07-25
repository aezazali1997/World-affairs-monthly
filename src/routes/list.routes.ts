import express from 'express';
import { ListController } from '../controllers/list.controller'
const listController = new ListController();
export const ListRouter = express.Router();

ListRouter.get('/', listController.getList)
ListRouter.get('/male-female-stats', listController.maleVsFemale)
ListRouter.get('/age-stats', listController.ageStats)

