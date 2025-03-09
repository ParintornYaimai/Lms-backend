import express from 'express'
import http from 'http';
import cors, { CorsOptions } from 'cors'
import dotenv from 'dotenv'
import cookiePaser from 'cookie-parser'
import {connectToDb} from '../config/connectToDB';
import log from '../src/util/logger'
import {initRedis} from '../config/connectToRedis'
import scheduleJobs from './crons/scheduleJobs'
import {authRateLimiter, publicRateLimiter} from './util/rateLimit'
import { initializeSocket } from './socket/socket';

//route
import authRouter from './modules/auth/auth.routes' 
import noteRouter from './modules/note/note.routes'
import commentRouter from './modules/comment/comment.routes'
import assignmentRouter from './modules/assignments/assignment.routes'
import { authenticateToken } from './middleware/authenticateToken';
import userRouter from '../src/modules/user/user.routes';
import upload from './modules/file/file.routes'
import course from './modules/courses/course.routes'
import enrolle from './modules/enrolle/enrolled.routes'
import feedback from './modules/feedback/feedback.routes'
import addfriends from './modules/addfriend/addfriends.routes'
import chat from './modules/chat/chat.routes'
import message from './modules/message/message.routes'
import dashboard from './modules/dashboard/dashboard.routes'
import resource from './modules/resource/resource.routes'
// import errorHandler from './middleware/errorHandler';


dotenv.config();

const app = express()
const server = http.createServer(app)
const io = initializeSocket(server)

// cors option
const allowedOrigins = ['http://localhost:3000','http://localhost:3001','https://educationwingplatform.com'];
const corsOption: CorsOptions  = {
    origin: (origin,callback) =>{
        if(!origin || allowedOrigins.includes(origin)  ){
            callback(null, true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    credentials: true,
}


//middleware
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookiePaser())
app.set('socketIO', io);



//route
app.use('/api/auth',authRateLimiter,authRouter);
app.use('/api/note',publicRateLimiter,authenticateToken,noteRouter);
app.use('/api/comment',publicRateLimiter,authenticateToken,commentRouter);
app.use('/api/assignment',publicRateLimiter,authenticateToken,assignmentRouter)
app.use('/api/user', publicRateLimiter,authenticateToken,userRouter);
app.use('/api/file',publicRateLimiter,authenticateToken,upload)
app.use('/api/course',publicRateLimiter,authenticateToken,course)
app.use('/api/enrolle',publicRateLimiter,authenticateToken,enrolle)
app.use('/api/feedback',publicRateLimiter,authenticateToken,feedback)
app.use('/api/addfriend',publicRateLimiter,authenticateToken,addfriends)
app.use('/api/chat',publicRateLimiter,authenticateToken,chat)
app.use('/api/message',publicRateLimiter,authenticateToken,message)
app.use('/api/dashboard',publicRateLimiter,authenticateToken,dashboard)
app.use('/api/resource',publicRateLimiter,authenticateToken,resource)

const port = process.env.PORT 
server.listen(port,async()=> {
    log.info(`server start on port: ${port}`)
    await connectToDb()
    await initRedis()
    scheduleJobs ()
})