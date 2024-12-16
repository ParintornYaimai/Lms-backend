import { Server } from 'socket.io';
import http from 'http';
import { socketRoutes } from './socketRoutes'; // รวม event ของ socket

export const initializeSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5500',
      methods: ["GET", "POST"],
      credentials: true 
    },
  });

  // เรียกใช้ event ที่กำหนดไว้ใน socketRoutes
  socketRoutes(io);

  return io;
};


