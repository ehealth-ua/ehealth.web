import { ApolloClient } from "apollo-client";
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

  const errorLink = onError(({ networkError, operation }) => {
    let operationType;

    visit(operation.query, {
      OperationDefinition(node) {
        operationType = node.operation;
        return BREAK;
      }
    });

    handleError({
      error: networkError.result.error,
      blocking: operationType === "query"
    });
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
