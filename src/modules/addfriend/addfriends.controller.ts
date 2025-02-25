import { Request, Response } from "express";
import addFriendsService from '../addfriend/addfriends.service'
import log from "../../util/logger";


class addFriendsController{
    
    async getAll(req: Request, res: Response){
        try {
            const getAllData = await addFriendsService.getAll(req.user.id);
            
            req.app.get('socketIO').to(req.user.id).emit('addFriend:getAll',getAllData );
            res.status(200).json({success: true,getAllData})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    async search(req: Request, res: Response){
        try {
            const searchData = await addFriendsService.search(req.body.email, req.user.id);

            req.app.get('socketIO').to(req.user.id).emit('addFriend:search',searchData );
            res.status(200).json({success: true,searchData})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    async create(req: Request, res: Response){
        const {fromuser, toUserId } = req.body;
        try {
            const createData = await addFriendsService.create({fromuser, toUserId });

            req.app.get('socketIO').to(req.user.id).emit('addFriend:create',createData );
            res.status(200).json({success: true,createData})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    async update(req: Request, res: Response){
        const toUserId = req.params.id
        try {
            const updated = await addFriendsService.updated(req.user.id, toUserId)

            req.app.get('socketIO').to(req.user.id).emit('addFriend:update',updated );
            res.status(200).json({success: true,updated})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }

    async delete(req: Request, res: Response){
        const toUserId = req.params.id
        try {
            const deleteData = await addFriendsService.delete(req.user.id, toUserId)

            req.app.get('socketIO').to(req.user.id).emit('addFriend:delete',deleteData );
            res.status(200).json({success: true,deleteData})
        } catch (error: any) {
            res.status(500).json({success: false,message:error.message,error:'Internal server error'});
            log.error(error.message);
        }
    }
}

export default new addFriendsController();