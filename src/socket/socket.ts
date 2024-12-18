import { Server } from 'socket.io';
import http from 'http';
// import { socketRoutes } from './socketRoutes'; 
import express from 'express';


const app = express();
export const initializeSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5500',
      methods: ["GET", "POST", "PUT", "PATCH"],
      credentials: true 
    },
  });

  // socketRoutes(io);
  app.set('socketIO', io);
  return io;
};


