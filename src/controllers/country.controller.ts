import { Request, Response } from 'express';
import { getCountriesReport } from '../services/googleAnalytics'
export class CountryController {
    static async get24HourCountriesList(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.body
            if (!startDate || !endDate) {
                return res.status(400).send('startDate and EndDate is required')
            }
            let data = await getCountriesReport(startDate, endDate);
            res.status(200).json({

                data
            })
        } catch (error) {
            console.log('Error', error);
        }
    }

}