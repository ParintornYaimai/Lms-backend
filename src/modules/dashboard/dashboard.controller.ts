import { Request, Response } from "express";
import log from "../../util/logger";
import dashboardService from "./dashboard.service";


class dashboardController{

    async finishAssignment(req: Request, res: Response){
        try{
            const data = await dashboardService.finishAssignment(req.user.id);

            res.status(200).json(data);
        }catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

}

export default new dashboardController();