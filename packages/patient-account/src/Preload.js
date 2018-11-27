import React from "react";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
const DictionaryQuery = loader("./graphql/DictionaryQuery.graphql");

const Preload = ({ children }) => (
  <Query
    fetchPolicy="cache-first"
    context={{ credentials: "same-origin" }}
    query={DictionaryQuery}
  >
    {({ loading, error, data }) => {
      if (loading || error) return null;
      return children;
    }}
  </Query>
);

export default Preload;
