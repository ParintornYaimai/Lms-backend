import { EnrolledModel } from "../../model/enrolled.Model";
import { CourseModel } from "../../model/course.Model";
import mongoose from "mongoose";

class resourseService {
    async getAll(userId: string) {
        const newObjId = new mongoose.Types.ObjectId(userId);

        const result = await EnrolledModel.aggregate([
            { $match: { student: newObjId } },
            {
                $lookup: {
                    from: CourseModel.collection.name,
                    localField: "course",
                    foreignField: "_id",
                    as: "courseInfo"
                }
            },
            { $match: { "courseInfo.0": { $exists: true } } },
            { $unwind: "$courseInfo" },
            { $match: { "courseInfo.coursecrm.lectures.contentType": "file" } },
            {
                $project: {
                    _id: 0,
                    courseId: "$courseInfo._id",
                    courseTitle: "$courseInfo.title",
                    file: "$courseInfo.coursecrm.lectures.contentValue"
                }
            }
        ]);

        const flatResult = result.map(item => ({...item, file: Array.isArray(item.file) ? item.file.flat(Infinity) : item.file,}));

        return flatResult
    }
}

export default new resourseService();