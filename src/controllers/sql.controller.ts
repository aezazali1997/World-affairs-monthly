import { Request, Response } from 'express';
import { SQLService } from '../services/sql';

export class SqlController {
    sqlService: SQLService
    constructor() {
        this.sqlService = SQLService.init();
    }


    getIPs = async (req: Request, res: Response) => {
        const { pageSize, pageNumber } = req.body


        try {
            let data = await this.sqlService.getAllIP(pageNumber, pageSize);
            return res.status(200).json({ data })

        } catch (error) {
            res.status(400).send('Error while fetching data');
        }
    }

}
