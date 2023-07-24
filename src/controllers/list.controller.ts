import { Request, Response } from 'express';
import { getList, maleVsFemale, AgeStats } from '../services/googleAnalytics';

export class ListController {
    static async getList(req: Request, res: Response) {



        const { startDate, endDate } = req.body
        if (!startDate || !endDate) {
            return res.status(400).send('startDate and EndDate is required')
        }


        try {
            let data = await getList(startDate, endDate);
            res.status(200).json({
                data
            });
        } catch (error) {
            res.status(400).send('Error while fetching data');
        }
    }

    static async maleVsFemale(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.body
            if (!startDate || !endDate) {
                return res.status(400).send('startDate and EndDate is required')
            }
            let data = await maleVsFemale(startDate, endDate);
            res.status(200).json({
                data
            });
        } catch (error) {
            res.status(400).send('Error while fetching male vs female data');
        }
    }

    static async ageStats(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.body
            if (!startDate || !endDate) {
                return res.status(400).send('startDate and EndDate is required')
            }
            let data = await AgeStats(startDate, endDate);
            res.status(200).json({
                data
            });
        } catch (error: any) {
            console.log("error", error.message);
            res.status(500).send('Internal Server Error');
        }
    }
}
