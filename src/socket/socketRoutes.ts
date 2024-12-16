import { Server } from 'socket.io';
// import { chatController } from '../controllers/chatController';
// import noteController from '../modules/note/note.controller';

export const socketRoutes = (io: Server) => {
  // เมื่อมีการเชื่อมต่อ socket.io
  io.on('connection', (socket) => {
    console.log('User connected');

    // เรียกใช้ controller สำหรับ chat และ post
    // noteController(socket);
    // postController(socket);

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
