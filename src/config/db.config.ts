import mongoose from "mongoose";

// Database Connection

let isConnected = false;

const dbConfig = async () => {
  if (isConnected) {
    return;
  }

  // Check if we already have an active connection
  if (mongoose.connections.length > 0) {
    const readyState = mongoose.connections[0].readyState;
    if (readyState === 1) {
      isConnected = true;
      return;
    }
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!);
    isConnected = true;
    console.log("Connected to the Database");
  } catch (error) {
    console.log("Error: ", error);
  }
};

export default dbConfig;
