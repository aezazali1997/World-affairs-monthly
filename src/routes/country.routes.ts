import Express from "express";
import { CountryController } from '../controllers/country.controller'
const countContr = new CountryController();
export const CountryRouter = Express.Router();

CountryRouter.get('/', countContr.get24HourCountriesList);