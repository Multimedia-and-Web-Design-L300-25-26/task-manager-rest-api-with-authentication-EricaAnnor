import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";

dotenv.config({ path: ".env.test" });

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  const { collections } = mongoose.connection;

  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
