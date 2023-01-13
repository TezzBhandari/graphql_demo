import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import cors from "cors";
import http from "http";
import typeDefs from "./typeDefs";

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const resolvers = {
  Query: {
    books: () => {
      return books;
    },
  },
};

const app = express();
//console.log(app)

const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// console.log(server);
const main = async () => {
  try {
    await server.start();
    app.use(
      cors<cors.CorsRequest>(),
      express.json({ limit: "50mb" }),
      expressMiddleware(server)
    );
    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 4000 }, resolve)
    );
    console.log(`🚀 Server ready at http://localhost:4000/`);
  } catch (err: any) {
    console.log(err);
    console.log("failed to start the server");
  }
};

// const main = async () => {
//   try {
//     const { url } = await startStandaloneServer(server, {
//       listen: { port: 4000 },
//     });

//     console.log(`🚀  Server ready at: ${url}`);
//   } catch (err) {
//     console.log(err);
//   }
// };

main();
