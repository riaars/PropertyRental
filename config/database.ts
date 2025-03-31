import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  //if the database is connected, dont connect again.

  if (connected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables"
      );
    }
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log("MongoDB is connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
