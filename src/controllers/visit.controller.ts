import { Request, Response } from 'express';
import { getWebsiteViews } from '../services/googleAnalytics'

export class VisitController {
    static async get24HourVisitList(req: Request, res: Response) {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }
        let data = await getWebsiteViews(startDate, endDate);
        return res.status(200).json({
            "totalVisits": data
        })
    }

}