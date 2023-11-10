import Mongoose from "mongoose";
import { env, mongo } from "../config/environment";

let isConnected;
let db;

const connectDB = async () => {
  if (isConnected) return db;

  try {
    if (env.development) {
      db = await Mongoose.connect(mongo.url);
      console.log("Connected to the DEV database");
    }

    if (env.test) {
      db = await Mongoose.connect(mongo.test_url);
      console.log("Connected to the TEST database");
    }

    isConnected = db.connections[0].readyState;
    return db;
  } catch (err) {
    throw new Error(err);
  }
};

export default connectDB;

export async function closeConnection() {
  if (!isConnected) return;

  await Mongoose.connection.close();
}

export async function dropTestDatabase() {
  if (!isConnected) return;

  if (!env.test) return;

  await Mongoose.connection.db.dropDatabase();
  console.log("TEST database was dropped");

  await Mongoose.connection.close();
}
