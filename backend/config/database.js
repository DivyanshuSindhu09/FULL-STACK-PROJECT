import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log("Darabase connected successfully");
    })
    //! event wala fuction upar rkhna hai
    await mongoose.connect(`${process.env.MONGODB_URI}/Axora`);
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1); // Exit the process with failure
  }
}

export default connectDB;