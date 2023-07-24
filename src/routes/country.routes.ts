import Express from "express";
import { CountryController } from '../controllers/country.controller'
export const CountryRouter = Express.Router();

CountryRouter.get('/', CountryController.get24HourCountriesList);