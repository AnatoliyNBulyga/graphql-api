import jwt from "jsonwebtoken";
import { jwtToken } from "../config/environment";

export const getContext = (req) => {
  const token = req.headers.authorization || "";
  try {
    const user = jwt.verify(token, jwtToken.secret);
    return user;
  } catch (error) {
    return null;
  }
};
