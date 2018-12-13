import React from "react";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";

const DictionaryQuery = loader("../graphql/SearchDictionariesQuery.graphql");

type DictProps = {
  name: string,
  item: string,
  children: (data: { value: string }) => React.Node
};

const DictionaryValue = ({
  name = "",
  item = "",
  children,
  render = children
}: DictProps) => (
  <Query
    fetchPolicy="cache-first"
    query={DictionaryQuery}
    variables={{ first: 400 }}
  >
    {({
      loading,
      error,
      data: { dictionaries: { nodes: dictionaries = [] } = {} }
    }) => {
      if (loading || error) return null;
      const { values } = dictionaries.find(dict => dict.name === name);

      const value =
        typeof render !== "function"
          ? values[item]
            ? values[item]
            : item
          : values;

      return typeof render === "function" ? render(value) : value;
    }}
  </Query>
);

export default DictionaryValue;
