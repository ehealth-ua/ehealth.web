import { ApolloClient } from "apollo-client";
import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";
import { RestLink } from "apollo-link-rest";
import { fieldNameNormalizer, fieldNameDenormalizer } from "@ehealth/utils";
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
    fieldNameNormalizer,
    fieldNameDenormalizer
  }),
  defaultOptions: {
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
  }
});

export default client;
