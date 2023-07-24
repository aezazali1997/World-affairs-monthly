import { Request, Response } from 'express';
import { getTotalUsers, usersVSMonth, uniqueVisitors, uniqueVsReturningVisitors } from '../services/googleAnalytics'
export class UserController {
    static async getTotalUsers(req: Request, res: Response) {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }
        let data = await getTotalUsers(startDate, endDate);
        res.status(200).json({
            data
        })
    }
    static async usersVsMonth(req: Request, res: Response) {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }
        let data = await usersVSMonth(startDate, endDate)
        res.status(200).json({
            data
        })
    }
    static async uniqueVisitors(req: Request, res: Response) {
        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }
        let data = await uniqueVisitors(startDate, endDate)
        res.status(200).json({
            data
        })
    }
    static async uniqueVsReturningVisitors(req: Request, res: Response) {

        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }





        let data = await uniqueVsReturningVisitors(startDate, endDate)
        res.status(200).json({
            data
        })
    }


}