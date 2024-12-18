// import { Server } from 'socket.io';
// import log from '../util/logger';
// import {noteHandlers} from './note.Socket';
// // import {commentHandlers} from './comment.Socket'

// export const socketRoutes = (io: Server) => {
//   io.on('connection', (socket) => {

//     noteHandlers(io, socket);
//     // commentHandlers(io, socket);

//     socket.on('disconnect', () => {
//       log.info('User disconnected')
//     });
//   });
// };
