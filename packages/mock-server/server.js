require("@ehealth/env/load");
const { buildClientSchema } = require("graphql");
const faker = require("faker");
const {
  mergeSchemas,
  makeExecutableSchema,
  addMockFunctionsToSchema,
  makeRemoteExecutableSchema,
  ApolloServer
} = require("apollo-server");
const { setContext } = require("apollo-link-context");
const { HttpLink } = require("apollo-link-http");
const fetch = require("node-fetch");
const { document: typeDefs } = require("@ehealth-ua/schema");
const introspectionResult = require("./schema.json");
const resolvers = require("./lib/resolvers");
const schemaDirectives = require("./lib/directives");

const { PORT, WHITE_LIST_ORIGINS = "", SCHEMAS = "" } = process.env;

const http = new HttpLink({
  uri: "https://api.dev.edenlab.com.ua/graphql",
  fetch
});

const link = setContext((request, previousContext) => ({
  headers: {
    Cookie: previousContext.graphqlContext.cookie
  }
})).concat(http);

const cors = {
  origin: WHITE_LIST_ORIGINS.split(",").map(
    origin => new RegExp(`^(?:${origin})$`)
  ),
  credentials: true
};

const introspectionResultSchema = buildClientSchema(introspectionResult.data);

const mockSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives
});

const remoteSchema = makeRemoteExecutableSchema({
  schema: introspectionResultSchema,
  link
});

addMockFunctionsToSchema({
  schema: mockSchema,
  mocks: {
    ID: () =>
      Buffer.from(`mockGlobalID:${faker.random.uuid()}`).toString("base64"),
    UUID: () => faker.random.uuid(),
    Date: () => faker.date.past(2),
    // TODO: return Time with timeZone
    DateTime: () => faker.date.past(2),
    Time: () => faker.date.past(),
    PageInfo: () => ({
      hasNextPage: faker.random.boolean(),
      hasPreviousPage: faker.random.boolean(),
      startCursor: () =>
        Buffer.from(`mockStartCursor:${faker.random.uuid()}`).toString(
          "base64"
        ),
      endCursor: () =>
        Buffer.from(`mockEndCursor:${faker.random.uuid()}`).toString("base64")
    })
  },
  preserveResolvers: true
});

const schemas = arr => SCHEMAS.split(",").map(item => arr[item]);

const schema = mergeSchemas({
  schemas: schemas({ mockSchema, remoteSchema })
});

const server = new ApolloServer({
  schema,
  cors,
  mocks: true,
  mockEntireSchema: false,
  context: ({ req }) => ({
    cookie: req.headers.cookie
  })
});

server.listen(PORT, () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);
});
