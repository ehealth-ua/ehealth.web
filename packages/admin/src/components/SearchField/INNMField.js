//@flow
import * as React from "react";
import gql from "graphql-tag";
import { I18n } from "@lingui/react";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { Trans } from "@lingui/macro";
import debounce from "lodash/debounce";

import * as Field from "../Field";

const SearchINNMField = ({
  name,
  placeholder,
  label,
  getItemByKey
}: {
  name: string,
  placeholder: string,
  label?: React.ElementType,
  getItemByKey: string
}) => (
  <Query
    query={INNMsQuery}
    fetchPolicy="cache-first"
    variables={{
      skip: true
    }}
  >
    {({
      data: { innms: { nodes: innms = [] } = {} } = {},
      refetch: refetchINNMs
    }) => (
      <I18n>
        {({ i18n }) => (
          <Field.Select
            name={name}
            label={label || <Trans>INNM</Trans>}
            placeholder={i18n._(placeholder)}
            items={innms.map(innm => innm[getItemByKey])}
            filter={innms => innms}
            onInputValueChange={debounce(
              (value, { selectedItem, inputValue }) =>
                !isEmpty(name) &&
                selectedItem !== inputValue &&
                refetchINNMs({
                  skip: false,
                  first: 20,
                  filter: { [getItemByKey]: value }
                }),
              1000
            )}
          />
        )}
      </I18n>
    )}
  </Query>
);

const INNMsQuery = gql`
  query INNMsQuery($first: Int, $filter: INNMFilter, $skip: Boolean! = false) {
    innms(first: $first, filter: $filter) @skip(if: $skip) {
      nodes {
        id
        name
        nameOriginal
      }
    }
  }
`;

export default SearchINNMField;
