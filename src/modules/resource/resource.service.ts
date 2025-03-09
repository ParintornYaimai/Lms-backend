import { EnrolledModel } from "../../model/enrolled.Model";
import { CourseModel } from "../../model/course.Model";
import mongoose from "mongoose";

class resourseService{
    async getAll(userId: string) {
        const newObjId = new mongoose.Types.ObjectId(userId) 
        const EnrolledData = await EnrolledModel.find({ newObjId }).select('_id').lean();
        if (EnrolledData.length === 0) throw new Error('Enrolled not found');
    
        const enrolledIds = EnrolledData.map(enrollment => enrollment._id);
    
        const resources = await CourseModel.find({ _id: { $in: enrolledIds } });
        if (resources.length === 0) throw new Error('No courses found for the enrolled data');
        
        const fileContents = resources.map((data) => {
            return data.coursecrm.map((courseCRM) => courseCRM.section.content).flat().filter((content) => content.type === 'file'); 
        }).flat(); 
        return fileContents;
    }
}

export default new resourseService();