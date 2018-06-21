import React from "react";
import styled from "react-emotion/macro";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";

const DictionaryValue = ({ name, item, children, render = children }) => (
  <Query
    fetchPolicy="cache-first"
    context={{ credentials: "same-origin" }}
    query={gql`
      query DictionariesQuery {
        dictionaries @rest(path: "/dictionaries", type: "DictionariesPayload") {
          data @type(name: "Dictionary") {
            name
            values
          }
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading || error) return null;

      const { values } = data.dictionaries.data.find(
        dict => dict.name === name
      );

      const value = item !== undefined ? values[item] : values;

      return typeof render === "function" ? render(value) : value;
    }}
  </Query>
);
export default DictionaryValue;
