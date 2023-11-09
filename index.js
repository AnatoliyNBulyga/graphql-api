import express from "express";
import cors from "cors";
import graphqlServer from "./graphql";
import connectDB from "./db/index.js";
import { port } from "./config/environment";
import { expressMiddleware } from "@apollo/server/express4";
import { getContext } from "./utils/get-context";

const initServer = async () => {
  const app = express();

  await graphqlServer.start();

  app.use(cors());
  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(graphqlServer, {
      context: async ({ req }) => ({
        user: getContext(req),
      }),
    }),
  );

  try {
    await connectDB();
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }

  app.listen(port, () =>
    console.log(`Express server is running on port ${port}`),
  );
};

initServer();
