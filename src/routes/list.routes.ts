import express from 'express';
import { ListController } from '../controllers/list.controller'
const listController = new ListController();
export const ListRouter = express.Router();

ListRouter.post('/', listController.getList)
ListRouter.post('/male-female-stats', listController.maleVsFemale)
ListRouter.post('/age-stats', listController.ageStats)

