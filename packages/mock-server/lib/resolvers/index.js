const { GraphQLDate, GraphQLDateTime } = require("graphql-iso-date");
const GraphQLJSON = require("graphql-type-json");

const resolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON
};

module.exports = resolvers;
