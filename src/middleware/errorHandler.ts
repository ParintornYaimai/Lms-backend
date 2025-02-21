// import {Request, Response, NextFunction} from 'express'
// import log from '../util/logger';

// const errorHandler =(err: Error,req: Request, res: Response, next: NextFunction)=>{
//     console.log('active errorHandler');
    
//     log.error(err.stack)
//     res.status(500).json({
//         success: false,
//         message: err.message,
//         error:'Internal server errorssssss',
//     });
// }

// export default errorHandler;