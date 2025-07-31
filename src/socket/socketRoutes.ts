import { Server } from 'socket.io';
import log from '../util/logger';


export const socketRoutes = (io: Server) => {
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId as string; 
        if(!userId){
            log.error('No userId found');
            // return socket.disconnect(true);  
        }

        socket.join(userId);
        log.info(`User connected and joined personal room: ${userId}`);

        socket.on('joinRoom', (chatroomId: string, callback: (response: any) => void) => {
            try {
                socket.join(chatroomId);
                log.info(`User ${userId} joined room ${chatroomId}`);
                callback({ success: true, message: `Joined room ${chatroomId}` });
            } catch (error) {
                log.error('Failed to join room', error);
                callback({ success: false, message: 'Failed to join room' });
            }
        });

        socket.on('disconnect', () => {
            log.info('User disconnected')
        });
    });
};
