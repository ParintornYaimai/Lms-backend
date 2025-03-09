import { Server } from 'socket.io';
import log from '../util/logger';


export const socketRoutes = (io: Server) => {
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId as string; 

        if(!userId){
            log.error('No userId found');
            return socket.disconnect();  
        }

        socket.on('disconnect', () => {
            log.info('User disconnected')
        });
    });
};
