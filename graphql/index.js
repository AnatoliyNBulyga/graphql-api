import { ApolloServer } from 'apollo-server-express';
import schema from "./schema.js";
import { env, jwtToken } from "../config/environment";
import jwt from "jsonwebtoken";

const apolloServer = new ApolloServer({
    schema,
    playground: env.development,
    context: ({ req }) => {
        const token = req.headers.authorization || '';

        try {
            const user = jwt.verify(token, jwtToken.secret);
            return { user };
        } catch (error) {
            return { user: null };
        }
    },
});

export default apolloServer;