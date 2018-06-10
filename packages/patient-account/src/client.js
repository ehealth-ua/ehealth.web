import { ApolloClient } from "apollo-client";
<<<<<<< HEAD
import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";
import { RestLink } from "apollo-link-rest";
import { fieldNameNormalizer, fieldNameDenormalizer } from "@ehealth/utils";
import { InMemoryCache } from "apollo-cache-inmemory";
import { RestLink } from "apollo-link-rest";
import { REACT_APP_API_URL } from "./env";

const dataIdFromObject = object => {
  switch (object.__typename) {
    case "Dictionary":
      return `Dictionary:${object.name}`;
    default:
      return defaultDataIdFromObject(object);
  }
};

const client = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false,
    dataIdFromObject
  }),
  link: new RestLink({
    uri: REACT_APP_API_URL,
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    endpoints: { stats: "/reports/stats" },
    fieldNameNormalizer,
    fieldNameDenormalizer
  }),
  defaultOptions: {
    query: {
      errorPolicy: "all"
    },
    mutate: {
      errorPolicy: "all"
    }
  }

    credentials: "include"
  }),
  defaultOptions: {
    // watchQuery: {
    //   fetchPolicy: "cache-and-network",
    //   errorPolicy: "ignore"
    // },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all"
    },
    mutate: {
      errorPolicy: "all"
    }
  }
});

export default client;
