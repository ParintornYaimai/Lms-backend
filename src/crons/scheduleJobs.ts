import cornhjob from 'node-cron'
import authService from '../modules/auth/auth.service'
import assignmentService from '../modules/assignments/teacherAssignment.service';

const scheduleJobs=()=>{
    cornhjob.schedule('0 0 1-31/4 * *',async()=>{
        await authService.generateAndSetSecret()
    })

    cornhjob.schedule('0 0 * * *', async () => {
        await assignmentService.checkOverdueSubmissions();
        
    });
}

export default scheduleJobs

