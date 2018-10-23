import { ApolloClient } from "apollo-client";
import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";
import { concat } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { visit, BREAK } from "graphql";

import { REACT_APP_API_URL } from "./env";

const STATUS_NAMES = {
  400: "bad_request",
  401: "unauthorized",
  403: "forbidden",
  404: "not_found",
  409: "conflict",
  422: "unprocessable_entity",
  500: "internal_server_error",
  503: "service_unavailable"
};

export const createClient = ({ onError: handleError }) => {
  const cache = new InMemoryCache({
    addTypename: false,
    dataIdFromObject
  });

  const errorLink = onError(({ graphQLErrors, operation }) => {
    const getGraphqlError = () => {
      if (graphQLErrors) {
        for (let err of graphQLErrors) {
          return {
            message: err.message,
            type: STATUS_NAMES[err.extensions.exception.statusCode],
            statusCode: err.extensions.exception.statusCode
          };
        }
      }
      return null;
    };

    const graphqlError = getGraphqlError();

    const { message, statusCode, type } = graphqlError;

    if (statusCode === 422) return;

    const error = { message, type: type };

    let operationType;

    visit(operation.query, {
      OperationDefinition(node) {
        operationType = node.operation;
        return BREAK;
      }
    });

    handleError({ error, blocking: operationType === "query" });
  });

  const httpLink = new HttpLink({
    uri: REACT_APP_API_URL,
    credentials: "include"
  });

  return new ApolloClient({
    cache,
    link: concat(errorLink, httpLink),
    defaultOptions
  });
};

const dataIdFromObject = object => {
  switch (object.__typename) {
    case "Dictionary":
      return `Dictionary:${object.name}`;
    default:
      return defaultDataIdFromObject(object);
  }
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
