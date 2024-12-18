// import { Server, Socket } from "socket.io";
// import noteService from "../modules/note/note.service"; // เรียกใช้ userService

// export const noteHandlers = (io: Server, socket: Socket) => {

//     socket.on("note:getAll", async () => {
//         try {
//             const notes = await noteService.getAll();
//             io.emit("note:all", notes);
//         } catch (error) {
//             socket.emit("error", "Failed to get notes");
//         }
//     });

//     socket.on("note:getById", async (id: string) => {
//         try {
//             const notes = await noteService.getById(id);
//             socket.emit("note:all", notes);
//         } catch (error) {
//             socket.emit("error", "Failed to get notes");
//         }
//     });
    
//     socket.on("note:getAll", async (id: string) => {
//         try {
//             const notes = await noteService.getByIdForAccountId(id);
//             socket.emit("note:all", notes);
//         } catch (error) {
//             socket.emit("error", "Failed to get notes");
//         }
//     });
// };
