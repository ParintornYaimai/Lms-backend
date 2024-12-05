import cornhjob from 'node-cron'
import authService from '../modules/auth/auth.service'

const generatesecret=()=>{
    cornhjob.schedule('0 0 1-31/4 * *',async()=>{
        await authService.generateAndSetSecret()
    })
}

export default generatesecret

