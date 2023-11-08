import mongoose from "mongoose";

const status = ["TODO", "DOING", "DONE"];

const todoSchema= mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: status,
        default: status[0]
    },
    position: {
        type: Number,
        default: 0
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

}, {timestamps: true});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;