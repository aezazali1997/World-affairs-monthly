import { Request, Response } from 'express';
import { getMobileDesktopPercentage } from '../services/googleAnalytics'
export class DeviceController {
    static async getMobileDesktopPercentage(req: Request, res: Response) {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }

        try {

            let data = await getMobileDesktopPercentage(startDate, endDate);

            res.status(200).json({
                data
            })
        }
        catch (error) {
            res.status(400).send('failed server')

        }
    }

}