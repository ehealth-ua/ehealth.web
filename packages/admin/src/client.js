import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { concat } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";

import env from "./env";

class GraphQLError extends Error {
  name = "GraphQLError";

  constructor({ message, ...error }, operationName, variables) {
    super(message);

    Object.assign(this, error);

    this.operationName = operationName;
    this.variables = variables;
  }
}

class NetworkError extends Error {
  name = "NetworkError";

  constructor({ name, message, ...error }) {
    super(message);

    // NOTE: This assignment is potentially harmful, rewrite with props whitelisting if any issues will be encountered
    Object.assign(this, error);
  }
}

export const createClient = ({ onError: handleError }) => {
  const cache = new InMemoryCache();

  const errorLink = onError(
    ({
      graphQLErrors,
      networkError,
      operation,
      operation: { operationName, variables }
    }) => {
      const error = graphQLErrors
        ? new GraphQLError(graphQLErrors[0], operationName, variables)
        : new NetworkError(networkError);

      handleError({ error });
    }
  );

  const httpLink = new HttpLink({
    uri: env.REACT_APP_API_URL,
    credentials: "include"
  });

  return new ApolloClient({
    cache,
    link: concat(errorLink, httpLink),
    defaultOptions
  });
};

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "cache-first",
    errorPolicy: "all"
  },
  query: {
    errorPolicy: "all"
  },
  mutate: {
    errorPolicy: "all"
  }
};
