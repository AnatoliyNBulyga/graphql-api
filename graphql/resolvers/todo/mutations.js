import Todo from "../../../db/models/Todo.js";
import { GraphQLError } from "graphql/index";
import User from "../../../db/models/User";

const todoMutations = {
    addTodo: async (_, args, context) => {
        const currentUser = context.user;

        if (!currentUser) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }

        const allTodos = await Todo.find({
            authorId: currentUser.userId,
        });
        const defaultPosition = allTodos.length - 1;

        const newTodo = new Todo({
            ...args,
            position: defaultPosition + 1,
            authorId: currentUser.userId,
        });


        const createdTodo = await newTodo.save();

        if (!createdTodo) {
            throw new GraphQLError('Creating of todo was failed', {
                extensions: {
                    code: 'BAD_REQUEST',
                    http: { status: 400 },
                },
            });
        }

        // Update users todos array
        const todoOwner = await User.findByIdAndUpdate(
            currentUser.userId,
            { $push: { todos: createdTodo._id } },
        { new: true, useFindAndModify: false }
        );

        if (!todoOwner) {
            throw new GraphQLError('Updating owner of todo was failed', {
                extensions: {
                    code: 'BAD_REQUEST',
                    http: { status: 400 },
                },
            });
        }

        return newTodo;
    },
    deleteTodo: async (_, { id }, context) => {
        const currentUser = context.user;

        if (!currentUser) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }

        const deletedTodo = await Todo.findOneAndDelete({
            _id: id,
            authorId: currentUser.userId,
        });

        if (!deletedTodo) {
            throw new GraphQLError('Deleting of todo was failed', {
                extensions: {
                    code: 'BAD_REQUEST',
                    http: { status: 400 },
                },
            });
        }

        // Update users todos array
        const todoOwner = await User.findByIdAndUpdate(
            currentUser.userId,
            { $pull: { todos: deletedTodo._id } },
            { new: true, useFindAndModify: false }
        );

        if (!todoOwner) {
            throw new GraphQLError('Updating owner of todo was failed', {
                extensions: {
                    code: 'BAD_REQUEST',
                    http: { status: 400 },
                },
            });
        }
        return "Todo has been deleted";
    },
    updateTodo: async (_, args, context) => {
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
        const updatedTodo = await Todo.findOneAndUpdate(
            {
                _id: id,
                authorId: currentUser.userId,
            },
            {
                ...restArgs,
            },
            { new: true }
        );

        if (!updatedTodo) {
            throw new GraphQLError('Updating of todo was failed', {
                extensions: {
                    code: 'BAD_REQUEST',
                    http: { status: 400 },
                },
            });
        }

        return updatedTodo;
    },
    updatePositionTodo: async (_, args, context) => {

        try {
            const currentUser = context.user;

            if (!currentUser) {
                throw new GraphQLError('User is not authenticated', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                        http: { status: 401 },
                    },
                });
            }

            const { id, newPosition } = args;

            // Fetch the item being moved
            const todoToMove = await Todo.findOne({
                _id: id,
                authorId: currentUser.userId,
            });


            if (!todoToMove) {
                throw new GraphQLError('Todo not found', {
                    extensions: {
                        code: 'BAD_REQUEST',
                        http: { status: 404 },
                    },
                });
            }

            const oldPosition = todoToMove.position;

            if (newPosition === oldPosition) {
                return "Todo has the same position";
            }

            // Determine the direction of the move
            if (newPosition < oldPosition) {
                // Item moved up in the list, increment positions between new and old positions
                await Todo.updateMany({
                    authorId: currentUser.userId,
                    position: { $gte: newPosition, $lt: oldPosition }
                }, { $inc: { position: 1 } });
            } else if (newPosition > oldPosition) {
                // Item moved down in the list, decrement positions between old and new positions
                await Todo.updateMany({
                    authorId: currentUser.userId,
                    position: { $gt: oldPosition, $lte: newPosition }
                }, { $inc: { position: -1 } });
            }

            todoToMove.position = newPosition;
            const updatedToMove = await todoToMove.save();

            if (!updatedToMove) {
                throw new GraphQLError('Todo not found', {
                    extensions: {
                        code: 'BAD_REQUEST',
                        http: { status: 404 },
                    },
                });
            }

            return "Todo reordered successfully";

        } catch (error) {

            throw new GraphQLError('Reordering of todo was failed', {
                extensions: {
                    code: 'BAD_REQUEST',
                    http: { status: 400 },
                },
            });

        }
    }
};

export default todoMutations;