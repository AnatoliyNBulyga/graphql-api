import { connection } from "mongoose";
import connectDB from "../";
import User from "../models/User";
import { testUser } from "../../config/environment";
import bcrypt from "bcrypt";

export const seed = async () => {
  console.log("Seed running...");

  await connectDB();

  const candidate = await User.findOne({
    name: testUser.name,
  });

  if (candidate) {
    await User.deleteOne({ name: testUser.name });
  }

  // Create an Admin user for testing
  const hashedPassword = await bcrypt.hash(testUser.password, 10);
  const users = [
    new User({
      name: testUser.name,
      email: testUser.email,
      password: hashedPassword,
      role: testUser.role,
    }),
  ];

  const savings = [...users.map((user) => user.save())];

  await Promise.all(savings);

  console.log("Database seeded");

  connection.close();
};

seed();
