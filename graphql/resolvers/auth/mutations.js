import User from "../../../db/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtToken } from "../../../config/environment";
import { GraphQLError } from "graphql";

const authMutations = {
  signUp: async (_, { name, email, password }) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      const token = jwt.sign({ userId: newUser.id }, jwtToken.secret, {
        expiresIn: jwtToken.exp,
      });

      return {
        token,
        user: newUser,
      };
    } catch (error) {
      console.log("[SIGNUP_MUTATION_ERROR]: ", error);
      throw new GraphQLError("SignUp was failed", {
        extensions: {
          code: "BAD_REQUEST",
          http: { status: 400 },
        },
      });
    }
  },
  login: async (_, { email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new GraphQLError("Invalid credentials", {
        extensions: {
          code: "BAD_REQUEST",
          http: { status: 400 },
        },
      });
    }

    const isPassValid = await bcrypt.compare(password, user.password);

    if (!isPassValid) {
      throw new GraphQLError("Invalid credentials", {
        extensions: {
          code: "BAD_REQUEST",
          http: { status: 400 },
        },
      });
    }

    const token = jwt.sign({ userId: user.id }, jwtToken.secret, {
      expiresIn: jwtToken.exp,
    });

    return {
      token,
      user,
    };
  },
};

export default authMutations;
