import mongoose, { Schema, Document } from "mongoose";

export interface FeedbackType extends Document {
    courseId: mongoose.Types.ObjectId; 
    studentId: mongoose.Types.ObjectId;
    rating: number; 
    text?: string; 
    createdAt?: Date; 
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