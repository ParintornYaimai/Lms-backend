import logger from 'pino';
import dayjs from 'dayjs';


const level = process.env.LOGLEVEL as string || 'info'

const log = logger({
    transport:{
        targets: [
            { target: 'pino-pretty' }, 
            { target: 'pino/file', options: { destination: './logs/app.log' } } // บันทึกลงไฟล์
        ]
    },level,
    base:{
        pid: false,
    },
    timestamp: ()=> `,"time":"${dayjs().format('DD/MM/YYYY HH:mm:ss')}"`
});

export default log