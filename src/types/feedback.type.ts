import mongoose, { Schema, Document } from "mongoose";

export interface FeedbackType extends Document {
    course: mongoose.Types.ObjectId; 
    student: mongoose.Types.ObjectId;
    rating: number; 
    text?: string; 
    reatedAt?: Date; 
}

export interface CreateFeedback{
    courseId: mongoose.Types.ObjectId;
    rating: number,
    text: String
}

export interface UpdateFeedBack{
    courseId: mongoose.Types.ObjectId;
    feedbackId: mongoose.Types.ObjectId;
    rating?: number,
    text?: String
}

export interface DeleteFeedBack{
    courseId: mongoose.Types.ObjectId;
    feedbackId: mongoose.Types.ObjectId;
}