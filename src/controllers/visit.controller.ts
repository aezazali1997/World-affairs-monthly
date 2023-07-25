import { Request, Response } from 'express';
import { GoogleAnalyticsDataApi } from '../services/googleAnalytics'

export class VisitController {

    googleAnalytics = new GoogleAnalyticsDataApi();

    constructor() {
        this.get24HourVisitList = this.get24HourVisitList.bind(this);
    }

    async get24HourVisitList(req: Request, res: Response) {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }
        let data = await this.googleAnalytics.getWebsiteViews(startDate, endDate);
        return res.status(200).json({
            data
        })
    }

}