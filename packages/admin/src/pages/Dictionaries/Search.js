import React from "react";
import { Flex, Box, Heading } from "rebass/emotion";
import { Query } from "react-apollo";
import { Form, LocationParams } from "@ehealth/components";
import { AdminSearchIcon } from "@ehealth/icons";

import isEmpty from "lodash/isEmpty";

import * as Field from "../../components/Field";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import Link from "../../components/Link";

import DictionariesQuery from "../../graphql/SearchDictionariesQuery.graphql";
import { ITEMS_PER_PAGE } from "../../constants/pagination";

const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      Словники
    </Heading>

    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { filter = {}, first, last, after, before } = locationParams;

        return (
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
            {({ loading, error, data }) => {
              if (loading) return null;
              const { nodes: dictionaries = [], pageInfo } = data.dictionaries;

              return (
                <>
                  <SearchDictionariesForm
                    initialValues={locationParams}
                    setLocationParams={setLocationParams}
                  />
                  {!error &&
                    dictionaries.length > 0 && (
                      <>
                        <Table
                          data={dictionaries}
                          header={{
                            name: "Назва словника",
                            labels: "Теги",
                            action: "Дія"
                          }}
                          renderRow={({ labels = [], ...dictionary }) => ({
                            ...dictionary,
                            labels: labels.join(", "),
                            action: (
                              <Link
                                to={`../${dictionary.name}`}
                                fontWeight="bold"
                              >
                                Переглянути
                              </Link>
                            )
                          })}
                          tableName="dictionaries/search"
                        />
                        <Pagination {...pageInfo} />
                      </>
                    )}
                </>
              );
            }}
          </Query>
        );
      }}
    </LocationParams>
  </Box>
);

export default Search;

const SearchDictionariesForm = ({ initialValues, setLocationParams }) => (
  <Form onSubmit={() => null} initialValues={initialValues}>
    <Form.AutoSubmit onSubmit={setLocationParams} />
    <Flex mx={-1}>
      <Box px={1} width={2 / 5}>
        <Field.Text
          name="filter.name"
          label="Знайти словник"
          placeholder="Назва словника"
          autocomplete="off"
        />
      </Box>

      <Box px={1} width={2 / 5}>
        <Field.Text
          name="filter.label"
          label="Фільтрувати за тегом"
          placeholder="Тег"
          autocomplete="off"
        />
      </Box>
    </Flex>
  </Form>
);
