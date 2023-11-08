import express from "express";
import cors from "cors";
import graphqlServer from './graphql/index.js';
import connectDB from "./db/index.js";
import { port } from "./config/environment";

const initServer = async () => {
    const app = express();

    await graphqlServer.start();
    graphqlServer.applyMiddleware({
        app,
    });

    app.use(cors());

    try {
        await connectDB();
        console.log('Connected to database');
    } catch (error) {
        console.log(error);
    }

    app.listen(port, () => console.log(`Express server is running on port ${port}`));


};

initServer();


