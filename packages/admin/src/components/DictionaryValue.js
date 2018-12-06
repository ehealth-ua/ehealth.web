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
  name,
  item,
  children,
  render = children
}: DictProps) => (
  <Query
    fetchPolicy="cache-first"
    context={{ credentials: "same-origin" }}
    query={DictionaryQuery}
    variables={{ first: 10, filter: { name } }}
  >
    {({
      loading,
      error,
      data: { dictionaries: { nodes: dictionaries = [] } = {} }
    }) => {
      if (loading || error) return null;

      const [{ values }] = dictionaries;

      const value =
        item !== undefined ? (values[item] ? values[item] : item) : values;

      return typeof render === "function" ? render(value) : value;
    }}
  </Query>
);

export default DictionaryValue;
