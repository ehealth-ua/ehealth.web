import React from "react";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";

const HomePage = () => (
  <Query
    query={gql`
      query {
        declarations
          @rest(path: "/cabinet/declarations", type: "DeclarationPayload") {
          data
        }
      }
    `}
  >
    {({ loading, error, data }) => (
      <pre>
        {loading
          ? "Loading"
          : error
            ? JSON.stringify(error, null, 2)
            : JSON.stringify(data, null, 2)}
      </pre>
    )}
  </Query>
);

export default HomePage;
