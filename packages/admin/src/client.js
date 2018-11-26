import { ApolloClient } from "apollo-client";
import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";
import { concat } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { visit, BREAK } from "graphql";

import { REACT_APP_API_URL } from "./env";

const STATUS_NAMES = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "UNPROCESSABLE_ENTITY",
  500: "INTERNAL_SERVER_ERROR",
  503: "SERVICE_UNAVAILABLE"
};

export const createClient = ({ onError: handleError }) => {
  const cache = new InMemoryCache({
    addTypename: false,
    dataIdFromObject
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    const getGraphqlError = () => {
      const checkedCode = (data, code) => {
        const [[key]] = Object.entries(data).filter(
          ([key, value]) => value === code
        );
        return key;
      };
      if (graphQLErrors) {
        for (let err of graphQLErrors) {
          return {
            message: err.message,
            statusCode: !err.extensions
              ? 500
              : err.extensions.code
                ? checkedCode(STATUS_NAMES, err.extensions.code)
                : err.extensions.exception.statusCode
          };
        }
      }
      return null;
    };

    const graphqlError = getGraphqlError();

    const { message, statusCode } = graphqlError || networkError;

    if (statusCode === 422) return;

    const error = { message, type: STATUS_NAMES[statusCode] };

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
