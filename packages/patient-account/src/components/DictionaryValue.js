import React from "react";
import { Query } from "react-apollo";
import DictionaryQuery from "../graphql/DictionaryQuery.graphql";

type DictProps = {
  name: string,
  item: string,
  children: (data: { value: string }) => React.Node
};

const DictionaryValue = ({
  name,
  item,
  children,
  render = children
}: DictProps) => (
  <Query
    fetchPolicy="cache-first"
    context={{ credentials: "same-origin" }}
    query={DictionaryQuery}
  >
    {({ loading, error, data }) => {
      if (loading || error) return null;

      const { values } = data.dictionaries.data.find(
        dict => dict.name === name
      );

      const value =
        item !== undefined ? (values[item] ? values[item] : item) : values;

      return typeof render === "function" ? render(value) : value;
    }}
  </Query>
);

export default DictionaryValue;
