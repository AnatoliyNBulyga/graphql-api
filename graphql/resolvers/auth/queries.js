import User from "../../../db/models/User";
import { GraphQLError } from "graphql";

const authQueries = {
  getCurrentUser: async (_, args, context) => {
    const user = context.user;

    if (!user) {
      throw new GraphQLError("User is not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    try {
      const userData = await User.findById(user.userId);
      return userData;
    } catch (error) {
      throw new GraphQLError("Unable to retrieve user data", {
        extensions: {
          code: "BAD_REQUEST",
          http: { status: 400 },
        },
      });
    }
  },
};

export default authQueries;
