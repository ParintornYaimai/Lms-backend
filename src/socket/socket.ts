import { Server } from 'socket.io';
import http from 'http';
import { socketRoutes } from './socketRoutes'; 


export const initializeSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ["GET", "POST", "PUT", "PATCH"],
      credentials: true 
    },
  });
  socketRoutes(io);
  return io;
};


