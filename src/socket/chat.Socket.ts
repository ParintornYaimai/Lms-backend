import { Server, Socket } from 'socket.io';
import messageService from '../modules/message/message.service';


export const chatHandler = (io: Server, socket: Socket) => {
    socket.on('chat:send', async (payload) => {
        try {
            // const message = await messageService.edit()

            
            // io.to(payload.id).emit('chat:receive', message);
        } catch (error) {
            console.error("Error processing message:", error);
            socket.emit('error', 'Failed to process your message');
        }
    });

    socket.on('chat:login', async (credentials, callback) => {
        try {
            io.emit('chat:create', ); 
            
        } catch (error) {
        
        }
    });
};

