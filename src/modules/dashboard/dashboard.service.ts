import mongoose from "mongoose";
import { EnrolledModel } from "../../model/enrolled.Model";
import { SubmissionModel } from "../../model/submission.Model";
import { AssignmentModel } from "../../model/assignment.Model";
import { CourseModel } from "../../model/course.Model";
import { CategoryModel } from "../../model/category.Model";


class dashboardService {

    async finishAssignment(userId: string) {
        const dashboardData = await EnrolledModel.aggregate([
            {
                $match: {
                    student: new mongoose.Types.ObjectId(userId),
                    status: "in-progress"
                }
            },
            {
                $lookup: {
                    from: AssignmentModel.collection.name,
                    localField: "course",
                    foreignField: "courseId",
                    as: "assignments"
                }
            },
            { $unwind: "$assignments" },
            {
                $lookup: {
                    from: SubmissionModel.collection.name,
                    let: {
                        studentId: "$student",
                        assignmentId: "$assignments._id"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$studentId", "$$studentId"] },
                                        { $eq: ["$assignmentId", "$$assignmentId"] },
                                        { $gt: [{ $size: "$files" }, 0] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "matched"
                }
            },
            {
                $project: {
                    _id: 0,
                    assignmentId: "$assignments._id",
                    submitted: {
                        $cond: [{ $gt: [{ $size: "$matched" }, 0] }, 1, 0]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAssignments: { $sum: 1 },
                    assignmentCompleted: { $sum: "$submitted" }
                }
            }
        ]);

        return dashboardData[0] || {
            totalAssignments: 0,
            assignmentCompleted: 0
        };
    }

    async Resource(userId: string) {
        const resourseData = await EnrolledModel.aggregate([
            {
                $match: {
                    student: new mongoose.Types.ObjectId(userId),
                    status: "in-progress"
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $lookup: {
                    from: CourseModel.collection.name,
                    localField: "course",
                    foreignField: "_id",
                    as: "courseInfo"
                }
            },
            {
                $unwind: "$courseInfo"
            },
            { $unwind: "$courseInfo.coursecrm" },
            { $unwind: "$courseInfo.coursecrm.lectures" },
            {
                $match: {
                    "courseInfo.coursecrm.lectures.contentType": "file",
                    "courseInfo.coursecrm.lectures.contentValue.0.0": { $exists: true }
                }
            },
            {
                $project: {
                    _id: 0,
                    courseTitle: "$courseInfo.title",
                    files: {
                        // รวม contentValue ที่เป็น array 2 มิติ มาเป็น 1 มิติ
                        $reduce: {
                            input: "$courseInfo.coursecrm.lectures.contentValue",
                            initialValue: [],
                            in: { $concatArrays: ["$$value", "$$this"] }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$courseTitle",
                    files: { $push: "$files" }
                }
            },
            {
                $project: {
                    courseTitle: "$_id",
                    files: {
                        $reduce: {
                            input: "$files",
                            initialValue: [],
                            in: { $concatArrays: ["$$value", "$$this"] }
                        }
                    },
                    _id: 0
                }
            },
            {
                $limit: 1
            }
        ]);

        return resourseData
    }

    async RecentEnrolled(userId: string) {
        const resourseData = await EnrolledModel.aggregate([
            {
                $match: {
                    student: new mongoose.Types.ObjectId(userId),
                    status: "in-progress"
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $lookup: {
                    from: CourseModel.collection.name,
                    localField: "course",
                    foreignField: "_id",
                    as: "courseInfo"
                }
            },
            { $unwind: "$courseInfo" },
            {
                $project: {
                    _id: 0,
                    courseId: "$courseInfo._id",
                    title: "$courseInfo.title",
                    duration: "$courseInfo.duration"
                }
            }
        ]);

        return resourseData;
    }

    async taskProgress(userId: string) {
        const resourseData = await EnrolledModel.aggregate([
            {
                $match: {
                    student: new mongoose.Types.ObjectId(userId),
                    status: "in-progress"
                }
            },
            {
                $lookup: {
                    from: CourseModel.collection.name,
                    localField: "course",
                    foreignField: "_id",
                    as: "courseInfo"
                }
            },
            { $unwind: "$courseInfo" },
            {
                $lookup: {
                    from: AssignmentModel.collection.name,
                    localField: "course",
                    foreignField: "courseId",
                    as: "assignments"
                }
            },
            { $unwind: "$assignments" },
            {
                $lookup: {
                    from: SubmissionModel.collection.name,
                    let: {
                        studentId: "$student",
                        assignmentId: "$assignments._id"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$studentId", "$$studentId"] },
                                        { $eq: ["$assignmentId", "$$assignmentId"] },
                                        { $gt: [{ $size: "$files" }, 0] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "matched"
                }
            },
            {
                $project: {
                    coursecate: "$courseInfo.coursecate",
                    submitted: {
                        $cond: [{ $gt: [{ $size: "$matched" }, 0] }, 1, 0]
                    }
                }
            },
            {
                $group: {
                    _id: "$coursecate",
                    totalAssignments: { $sum: 1 },
                    assignmentCompleted: { $sum: "$submitted" }
                }
            },
            {
                $lookup: {
                    from: CategoryModel.collection.name,
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryInfo"
                }
            },
            { $unwind: "$categoryInfo" },
            {
                $project: {
                    categoryId: "$_id",
                    categoryName: "$categoryInfo.name",
                    totalAssignments: 1,
                    assignmentCompleted: 1,
                    _id: 0
                }
            }
        ]);

        return resourseData;
    }
}

export default new dashboardService();