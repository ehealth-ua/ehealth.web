import React from "react";
import { Flex, Box, Heading } from "rebass/emotion";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";

import { Form, LocationParams } from "@ehealth/components";
import { RemoveItemIcon } from "@ehealth/icons";

import * as Field from "../../components/Field";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
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
              if (loading) return <Loader />;
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
                                to={`../${encodeURIComponent(dictionary.name)}`}
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
      <Box px={1} width={2 / 4}>
        <Field.Text
          name="filter.name"
          label="Знайти словник"
          placeholder="Назва словника"
          autocomplete="off"
        />
      </Box>

      <Box px={1} width={2 / 4}>
        <Field.Text
          name="filter.label"
          label="Фільтрувати за тегом"
          placeholder="Тег"
          autocomplete="off"
        />
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
          Скинути пошук
        </IconButton>
      </Box>
    </Flex>
  </Form>
);
