import { todoMutations, todoQueries } from "./todo";
import { userMutations, userQueries } from "./user";
import authQueries from "./auth/queries";
import authMutations from "./auth/mutations";

const resolvers = {
  Query: {
    ...todoQueries,
    ...userQueries,
    ...authQueries,
  },
  Mutation: {
    ...todoMutations,
    ...userMutations,
    ...authMutations,
  },
};

export default resolvers;
