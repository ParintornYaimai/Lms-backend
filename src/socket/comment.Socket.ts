// import { Server, Socket } from 'socket.io';
// import commentService from '../modules/comment/comment.service'; // เรียกใช้ userService

// export const commentHandlers = (io: Server, socket: Socket) => {
//   socket.on('comment:get', async (payload) => {
//     try {
//     //   const user = await userService.registerUser(payload);
//       io.emit('user:registered', user); // ส่งข้อมูล user ที่ลงทะเบียนเสร็จไปยัง client
//     } catch (error) {
//     //   socket.emit('error', 'Failed to register user');
//     }
//   });

// //   socket.on('user:login', async (credentials, callback) => {
// //     try {
// //       const user = await userService.loginUser(credentials);
// //       callback(user);
// //     } catch (error) {
// //       callback({ error: 'Failed to login' });
// //     }
// //   });
// };