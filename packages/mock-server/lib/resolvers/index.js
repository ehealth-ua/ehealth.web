const {
  GraphQLDate,
  GraphQLDateTime,
  GraphQLTime
} = require("graphql-iso-date");
const GraphQLJSON = require("graphql-type-json");
const GraphQLUUID = require("graphql-tools-type-uuid");

const resolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Time: GraphQLTime,
  JSON: GraphQLJSON,
  UUID: GraphQLUUID
};

module.exports = resolvers;
