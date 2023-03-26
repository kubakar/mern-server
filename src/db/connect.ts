import mongoose from "mongoose";

// returns promise
const connectDB = () => {
  const password = process.env.MONGO_PASSWORD;
  const dbName = "JOBIFY";

  const connectionString = `mongodb+srv://horneja:${password}@nodecluster.ssidncj.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  return mongoose.connect(connectionString);
};

export default connectDB;
