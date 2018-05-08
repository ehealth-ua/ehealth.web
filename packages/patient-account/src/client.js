import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { RestLink } from "apollo-link-rest";

import { REACT_APP_API_URL } from "./env";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new RestLink({
    uri: REACT_APP_API_URL
  })
});

export default client;
