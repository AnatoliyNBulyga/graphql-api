import User from "../../../db/models/User";
import {GraphQLError} from "graphql/index";
import Todo from "../../../db/models/Todo";


const userMutations = {
    updateUser: async (_, args, context) => {
        const currentUser = context.user;

        if (!currentUser) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }

        const { id, ...restArgs } = args;

        const updatedUser = await Todo.findOneAndUpdate(
            {
                _id: id,
                authorId: currentUser.userId,
            },
            {
                ...restArgs,
            },
            { new: true }
        );

        if (!updatedUser) {
            throw new GraphQLError('Updating of user was failed', {
                extensions: {
                    code: 'BAD_REQUEST',
                    http: { status: 400 },
                },
            });
        }

        return updatedUser;
    },
    deleteUser: async (_, { id }, context ) => {
        const currentUser = context.user;

        if (!currentUser) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }

        const userData = await User.findById(currentUser.userId);

        // Only ADMIN can delete a user
        // User cannot delete himself
        if (!userData || userData.role !== "ADMIN" || currentUser.userId === id ){
            throw new GraphQLError('Permission denied', {
                extensions: {
                    code: 'PERMISSION_DENIED',
                    http: { status: 403 },
                },
            });
        }
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new GraphQLError('Deleting of user was failed', {
                extensions: {
                    code: 'BAD_REQUEST',
                    http: { status: 400 },
                },
            });
        }
        return `User with ID ${id} has been deleted`;
    },
};

export default userMutations;