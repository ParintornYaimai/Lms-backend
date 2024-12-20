import { assignmentResponse,CreateAssignment } from '../../types/assignment.type';
import {AssignmentModel} from '../../model/assignment.Model'

class assignmentService{

    async getAll():Promise<assignmentResponse[]>{
        const assignments = await AssignmentModel.find().populate('course');
        if(assignments.length === 0) throw new Error('Data not found');

        return assignments;
    }
    
    async create({homeworkId, createdbyteacher, subject, course, passpercen, schedule, endDate, files, score, status, action}: CreateAssignment):Promise<assignmentResponse>{
        
        // ตรวจสอบค่าผ่านเปอร์เซ็นต์ (passpercen)
        if (isNaN(passpercen) || passpercen < 0 || passpercen > 100) {
            throw new Error('Pass percentage must be a number between 0 and 100');
        }

        if (schedule.length !== 2 || endDate.length !== 2) {
            throw new Error('Schedule and endDate must contain exactly two dates');
        }
        if (schedule[0] >= schedule[1]) {
            throw new Error('Schedule start date must be earlier than the end date');
        }
        if (endDate[0] <= schedule[1]) {
            throw new Error('End date must be after the schedule end date');
        }

        const newAssignment = await AssignmentModel.create({
            homeworkId,
            createdbyteacher,
            subject,
            course,
            passpercen,
            schedule,
            endDate,
            files,
            score,
            status,
            action,
        });

        return newAssignment;
    }

}


export default new assignmentService();