import React from "react";
import { Flex, Box, Heading } from "rebass/emotion";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
import createDecorator from "final-form-calculate";
import format from "date-fns/format";
import isEmpty from "lodash/isEmpty";
import system from "system-components/emotion";

import { Trans } from "@lingui/macro";

import { Form, LocationParams, Validation } from "@ehealth/components";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";
import {
  PositiveIcon,
  AdminSearchIcon,
  NegativeIcon,
  RemoveItemIcon
} from "@ehealth/icons";

import * as Field from "../../components/Field";
import Pagination from "../../components/Pagination";
import DictionaryValue from "../../components/DictionaryValue";
import Table from "../../components/Table";
import Link from "../../components/Link";
import LoadingOverlay from "../../components/LoadingOverlay";
import AddressView from "../../components/AddressView";
import Badge from "../../components/Badge";
import Button, { IconButton } from "../../components/Button";
import { ITEMS_PER_PAGE } from "../../constants/pagination";

const SettlementsQuery = loader("../../graphql/SettlementsQuery.graphql");
const SearchLegalEntitiesQuery = loader(
  "../../graphql/SearchLegalEntitiesQuery.graphql"
);

const ID_PATTERN =
  "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";

const EDRPOU_PATTERN = "^[0-9]{8,10}$";
const LEGALENTITY_ID_PATTERN =
  "^[0-9A-Za-zА]{8}-[0-9A-Za-zА]{4}-[0-9A-Za-zА]{4}-[0-9A-Za-zА]{4}-[0-9A-Za-zА]{12}$";
const SEARCH_REQUEST_PATTERN = `(${EDRPOU_PATTERN})|(${LEGALENTITY_ID_PATTERN})`;

const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      <Trans id="le.search_legal_entities">Search legal entities</Trans>
    </Heading>

    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          filter: { code, settlement, nhsVerified, type } = {},
          first,
          last,
          after,
          before,
          orderBy
        } = locationParams;
        const regId = new RegExp(ID_PATTERN);
        const testID = regId.test(code);
        const sendCodeParams = testID ? { databaseId: code } : { edrpou: code };

        const filteredParams = {
          ...sendCodeParams,
          nhsVerified: isEmpty(nhsVerified)
            ? undefined
            : nhsVerified.key === "VERIFIED",
          settlement: isEmpty(settlement) ? undefined : settlement.settlement,
          area: isEmpty(settlement) ? undefined : settlement.area,
          type: isEmpty(type) ? undefined : type.key
        };
        return (
          <>
            <SearchLegalEntitiesForm
              initialValues={locationParams}
              setLocationParams={setLocationParams}
            />
            <Query
              query={SearchLegalEntitiesQuery}
              fetchPolicy="network-only"
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
                orderBy,
                filter: !isEmpty(locationParams.filter)
                  ? filteredParams
                  : undefined
              }}
            >
              {({
                loading,
                error,
                data: {
                  legalEntities: { nodes: legalEntities = [], pageInfo } = {}
                },
                refetch
              }) => {
                if (error) return `Error! ${error.message}`;
                return (
                  <LoadingOverlay loading={loading}>
                    <Table
                      data={legalEntities}
                      header={{
                        id: "ID",
                        name: "Назва медзакладу",
                        type: "Тип медзакладу",
                        edrpou: "ЄДРПОУ",
                        addresses: "Адреса",
                        nhsVerified: "Верифікований НСЗУ",
                        nhsReviewed: "Розглянутий НСЗУ",
                        insertedAt: "Додано",
                        status: "Статус",
                        action: "Дія"
                      }}
                      renderRow={({
                        addresses,
                        nhsVerified,
                        nhsReviewed,
                        status,
                        insertedAt,
                        databaseId,
                        type,
                        ...legalEntity
                      }) => ({
                        ...legalEntity,
                        id: databaseId,
                        type: (
                          <DictionaryValue
                            name="LEGAL_ENTITY_TYPE"
                            item={type}
                          />
                        ),
                        nhsVerified: (
                          <Flex justifyContent="center">
                            {nhsVerified ? <PositiveIcon /> : <NegativeIcon />}
                          </Flex>
                        ),
                        nhsReviewed: (
                          <Flex justifyContent="center">
                            {nhsReviewed ? <PositiveIcon /> : <NegativeIcon />}
                          </Flex>
                        ),
                        insertedAt: format(insertedAt, "DD.MM.YYYY, HH:mm"),
                        status: (
                          <Badge
                            type="LEGALENTITY"
                            name={status}
                            display="block"
                          />
                        ),
                        addresses: (
                          <>
                            {addresses
                              .filter(a => a && a.type === "REGISTRATION")
                              .map(item => item && <AddressView data={item} />)}
                          </>
                        ),
                        action: (
                          <Link to={`../${legalEntity.id}`} fontWeight="bold">
                            Деталі
                          </Link>
                        )
                      })}
                      sortableFields={[
                        "edrpou",
                        "status",
                        "insertedAt",
                        "nhsVerified",
                        "nhsReviewed"
                      ]}
                      sortingParams={parseSortingParams(locationParams.orderBy)}
                      onSortingChange={sortingParams =>
                        setLocationParams({
                          ...locationParams,
                          orderBy: stringifySortingParams(sortingParams)
                        })
                      }
                      tableName="legal-entities/search"
                      whiteSpaceNoWrap={["id"]}
                      hiddenFields="insertedAt"
                    />
                    <Pagination {...pageInfo} />
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

const SearchLegalEntitiesForm = ({ initialValues, setLocationParams }) => (
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
    decorators={[resetValue]}
  >
    <Flex mx={-1}>
      <Box px={1} width={1 / 2}>
        <Field.Text
          name="filter.code"
          label="Пошук медзакладу за ЄДРПОУ"
          placeholder="ЄДРПОУ або ID медзакладу"
          postfix={<AdminSearchIcon color="#CED0DA" />}
          autocomplete="off"
        />
        <Validation.Matches
          field="filter.code"
          options={SEARCH_REQUEST_PATTERN}
          message="Невірний номер"
        />
      </Box>
    </Flex>
    <Flex mx={-1}>
      {/*<Box px={1} width={1 / 3}>*/}
      {/*<Query*/}
      {/*query={SettlementsQuery}*/}
      {/*fetchPolicy="cache-first"*/}
      {/*variables={{ name: "" }}*/}
      {/*context={{ credentials: "same-origin" }}*/}
      {/*>*/}
      {/*{({ loading, error, data, refetch }) => {*/}
      {/*if (loading) return null;*/}
      {/*const { nodes: settlements = [{}] } = data.settlements;*/}
      {/*return (*/}
      {/*<Field.Select*/}
      {/*name="filter.settlement"*/}
      {/*label="Населений пункт"*/}
      {/*placeholder="Введіть населений пункт"*/}
      {/*itemToString={item => {*/}
      {/*if (!item) return "";*/}
      {/*return typeof item === "string" ? item : item.settlement;*/}
      {/*}}*/}
      {/*items={settlements.map(({ name, district, type, region }) => ({*/}
      {/*area: region || undefined,*/}
      {/*settlement: name,*/}
      {/*settlementType: type,*/}
      {/*region: district || undefined*/}
      {/*}))}*/}
      {/*onInputValueChange={debounce(*/}
      {/*settlement => refetch({ name: settlement }),*/}
      {/*500*/}
      {/*)}*/}
      {/*filterOptions={{ keys: ["settlement"] }}*/}
      {/*renderItem={address => <AddressView data={address} />}*/}
      {/*size="small"*/}
      {/*/>*/}
      {/*);*/}
      {/*}}*/}
      {/*</Query>*/}
      {/*</Box>*/}

      <Box px={1} width={1 / 4}>
        <DictionaryValue
          name="LEGAL_ENTITY_TYPE"
          render={dict => (
            <Field.Select
              type="select"
              name="filter.type"
              label="Тип медзакладу"
              placeholder="Показати всі"
              itemToString={item => {
                if (!item) return "Показати всі";
                return typeof item === "string" ? item : item.value;
              }}
              items={[
                { value: "Показати всі", key: undefined },
                ...Object.entries(dict)
                  .filter(([key]) => key !== "MIS")
                  .map(([key, value]) => ({
                    value,
                    key
                  }))
              ]}
              renderItem={({ value }) => value}
              size="small"
            />
          )}
        />
      </Box>
      <Box px={1} width={1 / 4}>
        <DictionaryValue
          name="LEGAL_ENTITY_STATUS"
          render={dict => (
            <Field.Select
              type="select"
              name="filter.nhsVerified"
              label="Статус верифікації"
              placeholder="Всі статуси"
              itemToString={item => {
                if (!item) return "Всі статуси";
                return typeof item === "string" ? item : item.value;
              }}
              items={[
                { value: "Всі статуси", name: undefined },
                ...Object.entries(dict).map(([key, value]) => ({
                  value,
                  key
                }))
              ]}
              renderItem={({ value }) => value}
              size="small"
            />
          )}
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
              filter: null,
              searchRequest: null
            });
          }}
        >
          Скинути пошук
        </IconButton>
      </Box>
    </Flex>
  </Form>
);

const resetValue = createDecorator(
  {
    field: "filter.code",
    updates: {
      ["filter.settlement"]: (value, { filter = {} }) => {
        return value ? undefined : filter.settlement;
      },
      ["filter.nhsVerified"]: (value, { filter = {} }) => {
        return value ? undefined : filter.nhsVerified;
      }
    }
  },
  {
    field: "filter.settlement",
    updates: {
      ["filter.code"]: (value, { filter = {} }) => {
        return value ? undefined : filter.code;
      }
    }
  },
  {
    field: "filter.nhsVerified",
    updates: {
      ["filter.code"]: (value, { filter = {} }) => {
        return value ? undefined : filter.code;
      }
    }
  }
);
