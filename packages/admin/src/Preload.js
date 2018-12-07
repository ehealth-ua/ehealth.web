import React from "react";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
const DictionaryQuery = loader("./graphql/SearchDictionariesQuery.graphql");

const Preload = ({ children }) => (
  <Query
    fetchPolicy="cache-first"
    query={DictionaryQuery}
    variables={{ first: 400 }}
  >
    {({ loading, error, data }) => {
      if (loading || error) return null;
      return children;
    }}
  </Query>
);

export default Preload;
