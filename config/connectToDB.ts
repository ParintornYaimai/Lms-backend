import mongoose from "mongoose";
import log from "../src/util/logger";


const connectToDb = async()=>{
    
    const URL = `mongodb+srv://lmsproject442:${process.env.DATABASEPASSWORD}@cluster0.nvb7u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` as string

    if (!URL) {
        log.error("Database URL is not defined in .env file.");
        process.exit(1);
    }

    try {
        await mongoose.connect(URL)
        log.info('Database connection successful')

    } catch (error: any) {
        log.error("An error occurred while connecting to the database.", error.message)

        console.log(error.message)
        process.exit(1)
    }
}

export default connectToDb