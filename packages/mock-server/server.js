require("@ehealth/env/load");
const { ApolloServer } = require("apollo-server");
const { document: typeDefs } = require("@ehealth-ua/schema");

const resolvers = require("./lib/resolvers");
const schemaDirectives = require("./lib/directives");

const { PORT, WHITE_LIST_ORIGINS = "" } = process.env;

const cors = {
  origin: WHITE_LIST_ORIGINS.split(",").map(
    origin => new RegExp(`^(?:${origin})$`)
  ),
  credentials: true
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  cors,
  mocks: true,
  mockEntireSchema: false
});

server.listen(PORT, () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);
});
