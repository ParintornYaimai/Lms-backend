import { createSubmissionTypeModel } from "src/types/submission.type";
import { AssignmentModel } from "../../model/assignment.Model";
import { SubmissionModel } from "../../model/submission.Model";
import { EnrolledModel } from "../../model/enrolled.Model";
import { CourseModel } from "../../model/course.Model";
import mongoose from "mongoose";

class studentAssignment{
       
    //student
    async getAll(limit: number, page: number, userId: string, date: string, status: string) {
        const skip = (page - 1) * limit;
        const enrolledCourses = await EnrolledModel.find({ student: userId }).populate('course');
        const courseIds = enrolledCourses.map(enrollment => enrollment.course._id);
        
        let dateFilter = {};
        const now = new Date();
        
        if(date && date !== 'all'){
            switch(date){
                case 'today':
                    const startOfDay = new Date(now);
                    startOfDay.setHours(0, 0, 0, 0);
                    const endOfDay = new Date(now);
                    endOfDay.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        $or: [
                            { "date.start": { $gte: startOfDay, $lte: endOfDay } }, //เริ่มภายในวันนั้น
                            { "date.end": { $gte: startOfDay, $lte: endOfDay } }, //สิ้นสุดภายในวันนั้น
                            { 
                                "date.start": { $lte: startOfDay }, //ครอบคลุมทั้งวัน
                                "date.end": { $gte: endOfDay } 
                            }
                        ]
                    };
                break;
                    
                case 'this_week':
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(now.getDate() - now.getDay());
                    startOfWeek.setHours(0, 0, 0, 0);
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    endOfWeek.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        $or: [
                            { "date.start": { $gte: startOfWeek, $lte: endOfWeek } },
                            { "date.end": { $gte: startOfWeek, $lte: endOfWeek } },
                            { 
                                "date.start": { $lte: startOfWeek }, 
                                "date.end": { $gte: endOfWeek } 
                            }
                        ]
                    };
                break;
                    
                case 'this_month':
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    endOfMonth.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        $or: [
                            { "date.start": { $gte: startOfMonth, $lte: endOfMonth } },
                            { "date.end": { $gte: startOfMonth, $lte: endOfMonth } },
                            { 
                                "date.start": { $lte: startOfMonth }, 
                                "date.end": { $gte: endOfMonth } 
                            }
                        ]
                    };
                break;

                case 'this_year':
                    const startOfYear = new Date(now.getFullYear(), 0, 1);
                    startOfYear.setHours(0, 0, 0, 0);
                    const endOfYear = new Date(now.getFullYear(), 11, 31);
                    endOfYear.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        $or: [
                            { "date.start": { $gte: startOfYear, $lte: endOfYear } },
                            { "date.end": { $gte: startOfYear, $lte: endOfYear } },
                            { 
                                "date.start": { $lte: startOfYear }, 
                                "date.end": { $gte: endOfYear } 
                            }
                        ]
                    };
                break;
            }
        }
        
        const assignments = await AssignmentModel.aggregate([
            { $match: { 
                courseId: { $in: courseIds },
                ...dateFilter  // เพิ่ม date filter
            }},
            { $lookup: {
                from: CourseModel.collection.name,  
                localField: "courseId",
                foreignField: "_id",
                as: "courseInfo"  
            }},
            { $unwind: "$courseInfo" },
            
            // Lookup SubCategory for subject name 
            { $lookup: {
                from: "subcategories",
                localField: "courseInfo.coursesubjectcate",
                foreignField: "_id",
                as: "subjectInfo"
            }},
            
            // Lookup submission data
            { $lookup: {
                from: "submissions",
                let: { assignmentId: "$_id" },
                pipeline: [
                    { $match: { 
                        $expr: { 
                            $and: [
                                { $eq: ["$assignmentId", "$$assignmentId"] },
                                { $eq: ["$studentId", new mongoose.Types.ObjectId(userId)] }
                            ]
                        }
                    }}
                ],
                as: "submissionData"
            }},
            
            // Add computed fields
            { $addFields: {
                hasSubmission: { $gt: [{ $size: "$submissionData" }, 0] },
                submissionInfo: { $arrayElemAt: ["$submissionData", 0] }
            }},
            
            // Check if overdue
            { $addFields: {
                isOverdue: {
                    $and: [
                        { $eq: ["$hasSubmission", false] },
                        { $lt: ["$date", new Date()] }
                    ]
                }
            }},
            
            // Project final structure
            { $project: {
                _id: 1,
                title: 1,
                courseId: 1,
                courseName: "$courseInfo.title", 
                
                // Subject information 
                // courseSubject: "$courseInfo.coursetopic", // ใช้ coursetopic เป็น subject
                // หรือ
                courseSubject: { $arrayElemAt: ["$subjectInfo.name", 0] }, // ใช้ชื่อจาก SubCategory
                
                passpercen: 1,
                date: 1,
                files: 1,
                totalmark: 1,
                createdAt: 1,
                updatedAt: 1,
                
                // Submission status information - แก้ไขเงื่อนไขการตรวจสอบ 
                submissionStatus: {
                    $cond: {
                        if: { 
                            $and: [
                                { $gt: [{ $size: "$submissionData" }, 0] },
                                { $gt: [{ $size: { $ifNull: ["$submissionInfo.files", []] } }, 0] }
                            ]
                        },
                        then: "Done",
                        else: {
                            $cond: {
                                if: "$isOverdue",
                                then: "Overdue",
                                else: "Not Submitted"
                            }
                        }
                    }
                },
                //score
                submissionScore: {
                    $cond: {
                        if: { 
                            $and: [
                                { $gt: [{ $size: "$submissionData" }, 0] },
                                { $gt: [{ $size: { $ifNull: ["$submissionInfo.files", []] } }, 0] }
                            ]
                        },
                        then: "$submissionInfo.score",
                        else: null
                    }
                },
                //date
                submissionDate: {
                    $cond: {
                        if: { 
                            $and: [
                                { $gt: [{ $size: "$submissionData" }, 0] },
                                { $gt: [{ $size: { $ifNull: ["$submissionInfo.files", []] } }, 0] }
                            ]
                        },
                        then: "$submissionInfo.updatedAt",
                        else: null
                    }
                },
                //file
                submissionFiles: {
                    $cond: {
                        if: { 
                            $and: [
                                { $gt: [{ $size: "$submissionData" }, 0] },
                                { $gt: [{ $size: { $ifNull: ["$submissionInfo.files", []] } }, 0] }
                            ]
                        },
                        then: "$submissionInfo.files",
                        else: []
                    }
                }
            }},
            
            // เพิ่ม status filter หลังจาก project
            ...(status && status !== 'all' ? [
                { $match: {
                    submissionStatus: status === 'completed' ? 'Done' : 
                                    status === 'overdue' ? 'Overdue' : 
                                    status === 'not_submitted' ? 'Not Submitted' : status
                }}
            ] : []),
            
            { $sort: { createdAt: -1 } }, // เรียงตามวันที่สร้าง
            { $skip: skip },
            { $limit: limit }
        ]);
        
        // นับจำนวน assignments ทั้งหมดตาม filter
        const countPipeline = [
            { $match: { 
                courseId: { $in: courseIds },
                ...dateFilter
            }},
            { $lookup: {
                from: "submissions",
                let: { assignmentId: "$_id" },
                pipeline: [
                    { $match: { 
                        $expr: { 
                            $and: [
                                { $eq: ["$assignmentId", "$$assignmentId"] },
                                { $eq: ["$studentId", new mongoose.Types.ObjectId(userId)] }
                            ]
                        }
                    }}
                ],
                as: "submissionData"
            }},
            { $addFields: {
                hasSubmission: { $gt: [{ $size: "$submissionData" }, 0] },
                submissionInfo: { $arrayElemAt: ["$submissionData", 0] },
                isOverdue: {
                    $and: [
                        { $eq: [{ $gt: [{ $size: "$submissionData" }, 0] }, false] },
                        { $lt: ["$date", new Date()] }
                    ]
                }
            }},
            { $addFields: {
                submissionStatus: {
                    $cond: {
                        if: { 
                            $and: [
                                { $gt: [{ $size: "$submissionData" }, 0] },
                                { $gt: [{ $size: { $ifNull: ["$submissionInfo.files", []] } }, 0] }
                            ]
                        },
                        then: "Done",
                        else: {
                            $cond: {
                                if: "$isOverdue",
                                then: "Overdue",
                                else: "Not Submitted"
                            }
                        }
                    }
                }
            }},
            ...(status && status !== 'all' ? [
                { $match: {
                    submissionStatus: status === 'completed' ? 'Done' : 
                                    status === 'overdue' ? 'Overdue' : 
                                    status === 'not_submitted' ? 'Not Submitted' : status
                }}
            ] : []),
            { $count: "total" }
        ];
        
        const countResult = await AssignmentModel.aggregate(countPipeline);
        const totalAssignments = countResult.length > 0 ? countResult[0].total : 0;
        const totalPages = Math.ceil(totalAssignments / limit);

        return { page, limit, totalAssignments, totalPages, assignments };
    }

    async create({ assignmentId, studentId, files }: createSubmissionTypeModel) {

        const [result] = await AssignmentModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(assignmentId) }
            },
            {
                $lookup: {
                    from: EnrolledModel.collection.name, 
                    let: { studentId: new mongoose.Types.ObjectId(studentId) },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$student', '$$studentId'] },
                                        { $eq: ['$status', 'in-progress'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'enrollment'
                }
            },
            {
                $lookup: {
                    from: SubmissionModel.collection.name, 
                    let: { 
                        assignmentId: '$_id',
                        studentId: new mongoose.Types.ObjectId(studentId)
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$assignmentId', '$$assignmentId'] },
                                        { $eq: ['$studentId', '$$studentId'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'existingSubmission'
                }
            },
            {
                $project: {
                    _id: 1,
                    date: 1,
                    title: 1,
                    hasEnrollment: { $gt: [{ $size: '$enrollment' }, 0] },
                    existingSubmission: { $arrayElemAt: ['$existingSubmission', 0] }
                }
            }
        ]);

        if(!result) throw new Error('Assignment not found');
        if(!result.hasEnrollment) throw new Error('User is not enrolled in the course or not in-progress');
        
        const currentDate = new Date();
        const status = result.date.end < currentDate ? "Overdue" : "Submitted";

        //ถ้าเจอให้อัพเดท
        if(result.existingSubmission){
            const updatedSubmission = await SubmissionModel.findByIdAndUpdate(
                result.existingSubmission._id,
                { files, status },
                { new: true }
            );
            if(!updatedSubmission) throw new Error('Submission update failed');
            
            return updatedSubmission;
        }

        //ให้สร้างใหม่เเทน
        const newSubmission = await SubmissionModel.create({
            assignmentId,
            studentId,
            files,
            status
        });
        if(!newSubmission) throw new Error('Submission creation failed');
        
        return newSubmission;
    }
}

export default new studentAssignment();

