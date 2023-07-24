import express from 'express';
import { ListController } from '../controllers/list.controller'
export const ListRouter = express.Router();

ListRouter.get('/', ListController.getList)
ListRouter.get('/male-female-stats', ListController.maleVsFemale)
ListRouter.get('/age-stats', ListController.ageStats)

