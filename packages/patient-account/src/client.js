import { ApolloClient, ApolloError } from "apollo-client";
import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";
import { concat } from "apollo-link";
import { RestLink } from "apollo-link-rest";
import { onError } from "apollo-link-error";
import { visit, BREAK } from "graphql";
import { fieldNameNormalizer, fieldNameDenormalizer } from "@ehealth/utils";

import { REACT_APP_API_URL } from "./env";

export const createClient = ({ onError: handleError }) => {
  const cache = new InMemoryCache({
    addTypename: false,
    dataIdFromObject
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    const { message, statusCode, result } = networkError;
    let error = statusCode ? result.error : { type: "network", message };

    if (statusCode === 500) {
      error = {
        ...error,
        type: "internal_server_error"
      };
    }

    let operationType;

    visit(operation.query, {
      OperationDefinition(node) {
        operationType = node.operation;
        return BREAK;
      }
    });

    handleError({ error, blocking: operationType === "query" });
  });

  const restLink = new RestLink({
    uri: REACT_APP_API_URL,
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    fieldNameNormalizer,
    fieldNameDenormalizer
  });

  return new ApolloClient({
    cache,
    link: concat(errorLink, restLink),
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
    fetchPolicy: "cache-and-network",
    errorPolicy: "all"
  },
  query: {
    errorPolicy: "all"
  },
  mutate: {
    errorPolicy: "all"
  }
};
