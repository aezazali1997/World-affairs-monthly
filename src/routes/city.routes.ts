import Express from "express";
import { CityController } from '../controllers/city.controller'
import { adsense } from "googleapis/build/src/apis/adsense";
import { datastore } from "googleapis/build/src/apis/datastore";
export const CityRouter = Express.Router();

CityRouter.get('/', CityController.get24HourCitiesList);
