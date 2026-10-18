import mongoose from "mongoose"
export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL, {
            dbName: 'HotelManagementSystem',
        });
        console.log("DB Connected...");
    } catch (error) {
        console.log('Failed To Connect With DataBase')
        console.log(error)
    }
}



