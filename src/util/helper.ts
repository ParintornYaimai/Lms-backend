import { ObjectId } from "mongodb";

// ฟังก์ชันแปลงชนิดข้อมูล
export function convertToObjectIdArray(input: string | undefined): ObjectId[] {
    if (!input) {
        throw new Error("Input is undefined or invalid"); // ตรวจสอบหาก input เป็น undefined
    }
    return [new ObjectId(input)];
}