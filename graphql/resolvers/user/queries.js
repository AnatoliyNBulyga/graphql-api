import User from "../../../db/models/User.js";

const userQueries = {
  getAllUsers: async () => {
    const users = await User.find();
    return users;
  },
  getUserById: async (_, { id }) => {
    const user = await User.findById(id);
    return user;
  },
};

export default userQueries;
