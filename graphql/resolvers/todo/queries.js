import Todo from "../../../db/models/Todo.js";
import { GraphQLError } from "graphql/index";

const todoQueries = {
  getTodos: async (_, args, context) => {
    const currentUser = context.user;

    if (!currentUser) {
      throw new GraphQLError("User is not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const todos = await Todo.find({
      authorId: currentUser.userId,
    });
    return todos;
  },
  getTodoById: async (_, { id }, context) => {
    const user = context.user;

    if (!user) {
      throw new GraphQLError("User is not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    const todo = await Todo.findOne({
      _id: id,
      authorId: user.userId,
    });
    return todo;
  },
};

export default todoQueries;
