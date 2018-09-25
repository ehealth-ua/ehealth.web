const path = require("path");
const express = require("express");
const { importSchema } = require("graphql-import");
const { ApolloServer } = require("apollo-server-express");
const { WHITE_LIST_ORIGINS = "" } = process.env;

const resolvers = require("./resolvers");
const schemaDirectives = require("./directives");

const schemaPath = path.resolve(__dirname, "..", "__schema__", "index.graphql");

const createApplication = () => {
  const app = express();

  const typeDefs = importSchema(schemaPath);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    mocks: true,
    mockEntireSchema: false
  });

  const cors = {
    origin: WHITE_LIST_ORIGINS.split(",").map(
      origin => new RegExp(`^(?:${origin})$`)
    ),
    credentials: true
  };

  apolloServer.applyMiddleware({
    app,
    cors
  });

  return app;
};

module.exports = { createApplication };
