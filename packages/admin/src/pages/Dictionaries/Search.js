import React from "react";
import { Flex, Box, Heading } from "rebass/emotion";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
import { Trans } from "@lingui/macro";
import { Form, LocationParams } from "@ehealth/components";
import { RemoveItemIcon } from "@ehealth/icons";

import * as Field from "../../components/Field";
import Pagination from "../../components/Pagination";
import LoadingOverlay from "../../components/LoadingOverlay";
import Table from "../../components/Table";
import Link from "../../components/Link";
import Button, { IconButton } from "../../components/Button";

import { ITEMS_PER_PAGE } from "../../constants/pagination";

const DictionariesQuery = loader(
  "../../graphql/SearchDictionariesQuery.graphql"
);

const Search = () => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      <Trans>Dictionaries</Trans>
    </Heading>

    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { filter = {}, first, last, after, before } = locationParams;

        return (
          <>
            <SearchDictionariesForm
              initialValues={locationParams}
              setLocationParams={setLocationParams}
            />
            <Query
              query={DictionariesQuery}
              variables={{
                first:
                  !first && !last
                    ? ITEMS_PER_PAGE[0]
                    : first
                      ? parseInt(first)
                      : undefined,
                last: last ? parseInt(last) : undefined,
                after,
                before,
                filter: !isEmpty(filter) ? filter : undefined
              }}
            >
              {({
                loading,
                error,
                data: {
                  dictionaries: { nodes: dictionaries = [], pageInfo } = {}
                } = {}
              }) => {
                if (error) return `Error! ${error.message}`;
                return (
                  <LoadingOverlay loading={loading}>
                    {dictionaries.length > 0 && (
                      <>
                        <Table
                          data={dictionaries}
                          header={{
                            name: <Trans>Dictionary name</Trans>,
                            labels: <Trans>Tags</Trans>,
                            action: <Trans>Action</Trans>
                          }}
                          renderRow={({ labels = [], ...dictionary }) => ({
                            ...dictionary,
                            labels: labels.join(", "),
                            action: (
                              <Link
                                to={`../${encodeURIComponent(dictionary.name)}`}
                                fontWeight="bold"
                              >
                                <Trans>View</Trans>
                              </Link>
                            )
                          })}
                          tableName="dictionaries/search"
                        />
                        <Pagination {...pageInfo} />
                      </>
                    )}
                  </LoadingOverlay>
                );
              }}
            </Query>
          </>
        );
      }}
    </LocationParams>
  </Box>
);

export default Search;

const SearchDictionariesForm = ({ initialValues, setLocationParams }) => (
  <Form
    onSubmit={params =>
      setLocationParams({
        ...params,
        after: undefined,
        before: undefined,
        last: undefined,
        first: initialValues.first || ITEMS_PER_PAGE[0]
      })
    }
    initialValues={initialValues}
  >
    <Flex mx={-1}>
      <Box px={1} width={3 / 5}>
        <Trans
          id="Dictionary name"
          render={({ translation }) => (
            <Field.Text
              name="filter.name"
              label={<Trans>Find dictionary</Trans>}
              placeholder={translation}
              autocomplete="off"
            />
          )}
        />
      </Box>

      <Box px={1} width={2 / 5}>
        <Query
          query={DictionariesQuery}
          variables={{
            first: 1,
            filter: { name: "DICTIONARY_LABELS" }
          }}
        >
          {({ loading, error, data }) => {
            if (loading || error) return null;

            const listOfLabels = !isEmpty(data.dictionaries.nodes)
              ? Object.keys(data.dictionaries.nodes[0].values)
              : [];

            return (
              <Trans
                id="Tag"
                render={({ translation }) => (
                  <Field.Select
                    name="filter.label"
                    label={<Trans>Filter by Tag</Trans>}
                    placeholder={translation}
                    items={listOfLabels}
                    renderItem={item => item}
                    hideErrors
                  />
                )}
              />
            );
          }}
        </Query>
      </Box>
    </Flex>
    <Flex mx={-1} justifyContent="flex-start">
      <Box px={1}>
        <Button variant="blue">Шукати</Button>
      </Box>
      <Box px={1}>
        <IconButton
          icon={RemoveItemIcon}
          type="reset"
          disabled={isEmpty(initialValues.filter)}
          onClick={() => {
            setLocationParams({
              ...initialValues,
              filter: null
            });
          }}
        >
          <Trans>Reset</Trans>
        </IconButton>
      </Box>
    </Flex>
  </Form>
);
