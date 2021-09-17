import { IContext } from './interfaces/context.interface';
import { GraphQLSchema } from 'graphql';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import  enviroments from './config/enviroments';
import {ApolloServer, PubSub} from 'apollo-server-express';
import schema from './schema';
import expressPlayGround from 'graphql-playground-middleware-express';
import Database from './lib/databases';

// Configuración de ariables de entorno
if (process.env.NODE_ENV !== 'production') {
    const env = enviroments;
    console.log(env);
}

async function init() {
    const app = express();
    // Web Socket
    const pubsub = new PubSub();
    const corsFn = cors();

    app.use('*', corsFn);
    app.use(compression());

    const database = new Database();

    const db = await database.init();

    const context = async( {req, connection}: IContext ) => {
        const token = (req)? req.headers.authorization : connection.authorization;
        return { db, token, pubsub };
    };

    const server = new ApolloServer({
        schema,
        introspection: true,
        context
    });

    server.applyMiddleware({app});

    /*app.get('/', (req, res)=>{
        res.send('HOLA MUNDO');
    });*/

    app.get('/', expressPlayGround({
        endpoint: '/graphql'
    }));


    const httpServer = createServer(app);
    // Web Socket
    server.installSubscriptionHandlers(httpServer);
    const PORT = process.env.PORT || 2002;

    httpServer.listen({
        port: PORT
    },
    () => {
        console.log(`GraphQL Server => @: http://localhost:${PORT}/graphql API GRAPHQL`);
        console.log(`Web Socket Connection=> @: ws://localhost:${PORT}/graphql API GRAPHQL`);
    });

}

init();
