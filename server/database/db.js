import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {

        const uri = process.env.MONGODB_URI

        if(!uri){
            console.log("URI NOT FOUND :)");
        }
        
        await mongoose.connect(uri, {
            dbName: "LIBRARY_MANAGEMENT_SYSTEM_DATABASE"
        });

        console.log("Database connected successfully");
        

    } catch (error) {
        console.log(`Database not connected: ${error}`);
    }
}