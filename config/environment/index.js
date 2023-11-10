import dotenv from "dotenv";

const envObject = process.env.NODE_ENV
  ? { path: `.env.${process.env.NODE_ENV}` }
  : {};

dotenv.config(envObject);

const port = process.env.PORT || 5000;

// You may use this as a boolean value for different situations
const env = {
  development: process.env.NODE_ENV?.toLowerCase() === "development",
  test: process.env.NODE_ENV?.toLowerCase() === "test",
  staging: process.env.NODE_ENV?.toLowerCase() === "staging",
  production: process.env.NODE_ENV?.toLowerCase() === "production",
};

const mongo = {
  url: process.env.MONGO_URI,
  test_url: process.env.MONGO_URI_TEST,
};

const jwtToken = {
  secret: process.env.JWT_SECRET,
  exp: process.env.JWT_EXPIRATION,
};

const testUser = {
  name: process.env.USER_NAME,
  email: process.env.USER_EMAIL,
  password: process.env.USER_PASSWORD,
  role: process.env.USER_ROLE,
};

export { port, env, mongo, jwtToken, testUser };
