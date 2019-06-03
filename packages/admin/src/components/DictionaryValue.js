//@flow

import * as React from "react";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";

const DictionaryQuery = loader("../graphql/SearchDictionariesQuery.graphql");

type DictProps = {
  name: string,
  item: string,
  children?: (data: { value: string }) => React.Node
};

const DictionaryValue = ({ name = "", item = "", children }: DictProps) => (
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
      const dictionary: void | { [string]: any } = dictionaries.find(
        dict => dict.name === name
      );

      const values = dictionary && dictionary.values;

      const value: any =
        typeof children !== "function" && values
          ? values[item]
            ? values[item]
            : item
          : values;

      return typeof children === "function" ? children(value) : value;
    }}
  </Query>
);

export default DictionaryValue;
