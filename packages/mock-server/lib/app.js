const path = require("path");
const express = require("express");
const { importSchema } = require("graphql-import");
const { ApolloServer } = require("apollo-server-express");

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

  apolloServer.applyMiddleware({ app });

  return app;
};

module.exports = { createApplication };
