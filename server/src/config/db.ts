import mongoose from "mongoose";
import env from "./env";
import dns from "dns";

dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
]);

const connectDB = async () => {
  try {
    // console.log(env.MONGODB_URI);

    await mongoose.connect(env.MONGODB_URI);

    console.log("MongoDB Connected Successfully");
  } catch (err: any) {
    console.log(err.name);
    console.log(err.message);
    console.log(err.reason);
    console.dir(err, { depth: null });
  }
};

export default connectDB;