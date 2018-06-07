import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";

const DictionaryValue = ({ name, children, render }) => (
  <Query
    fetchPolicy="cache-first"
    context={{ credentials: "same-origin" }}
    query={gql`
      query DictionriesQuery {
        dictionaries @rest(path: "/dictionaries", type: "DictionariesPayload") {
          data
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading || error) return null;
      const { values } = data.dictionaries.data.find(
        dict => dict.name === name
      );
      return typeof render === "function" ? render(values) : values;
    }}
  </Query>
);
export default DictionaryValue;
