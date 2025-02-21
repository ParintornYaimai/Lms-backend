import mongoose, { Schema } from "mongoose";


const categorySchema = new Schema({
    name: { type: String},
    value: { type: String, required: true } 
}, { timestamps: true });

const subCategorySchema = new Schema({
    name: { type: String},
    value: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: true });

export const CategoryModel = mongoose.model('Category', categorySchema);
export const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);