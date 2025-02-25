import { Response, Request } from "express";
import log from "../../util/logger";
import resourceService from "./resource.service";

class resourceController{
    async getAll(req:Request, res:Response){
        try {
            const data = await resourceService.getAll(req.user.id);

            res.status(200).json(data);
        } catch (error:any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }
}

export default new resourceController();