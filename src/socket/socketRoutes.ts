import { Server } from 'socket.io';
import log from '../util/logger';
import {chatHandler} from './chat.Socket';
// import {commentHandlers} from './comment.Socket'

export const socketRoutes = (io: Server) => {
    io.on('connection', (socket) => {

        chatHandler(io, socket);

        socket.on('disconnect', () => {
            log.info('User disconnected')
        });
    });
};
