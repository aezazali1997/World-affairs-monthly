import { Request, Response } from 'express';
import { getCitiesReport } from '../services/googleAnalytics'
export class CityController {
    static async get24HourCitiesList(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.body
            if (!startDate || !endDate) {
                return res.status(400).send('startDate and EndDate is required')
            }
            let data = await getCitiesReport(startDate, endDate);
            return res.status(200).json({
                data
            })


        } catch (error) {

        }
        res.status(200);

    }
}