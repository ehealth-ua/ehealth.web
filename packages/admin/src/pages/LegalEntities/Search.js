import React from "react";
import Composer from "react-composer";
import { Flex, Box, Heading } from "@rebass/emotion";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
import createDecorator from "final-form-calculate";
import isEmpty from "lodash/isEmpty";
import { DateFormat, Trans } from "@lingui/macro";

import { Form, LocationParams, Validation } from "@ehealth/components";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";
import {
  PositiveIcon,
  SearchIcon,
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

// const SettlementsQuery = loader("../../graphql/SettlementsQuery.graphql");
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
      <Trans>Search legal entities</Trans>
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
            : nhsVerified === "VERIFIED",
          settlement: isEmpty(settlement) ? undefined : settlement.settlement,
          area: isEmpty(settlement) ? undefined : settlement.area,
          type
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
                }
              }) => {
                if (isEmpty(legalEntities)) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    <Table
                      data={legalEntities}
                      header={{
                        id: <Trans>ID</Trans>,
                        name: <Trans>Legal entity name</Trans>,
                        type: <Trans>Legal entity type</Trans>,
                        edrpou: <Trans>EDRPOU</Trans>,
                        addresses: <Trans>Address</Trans>,
                        nhsVerified: <Trans>NHS verified</Trans>,
                        nhsReviewed: <Trans>NHS reviewed</Trans>,
                        insertedAt: <Trans>Inserted at</Trans>,
                        status: <Trans>Status</Trans>,
                        action: <Trans>Action</Trans>
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
                        insertedAt: (
                          <DateFormat
                            value={insertedAt}
                            format={{
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric"
                            }}
                          />
                        ),
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
        <Trans
          id="Legal entity EDRPOU or ID"
          render={({ translation }) => (
            <Field.Text
              name="filter.code"
              label={<Trans>Search legal entity by EDRPOU</Trans>}
              placeholder={translation}
              postfix={<SearchIcon color="silverCity" />}
              autoComplete="off"
            />
          )}
        />
        <Validation.Matches
          field="filter.code"
          options={SEARCH_REQUEST_PATTERN}
          message="Invalid number"
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
        <Composer
          components={[
            <DictionaryValue name="LEGAL_ENTITY_TYPE" />,
            ({ render }) => <Trans id="Show all" render={render} />
          ]}
        >
          {([dict, { translation }]) => (
            <Field.Select
              name="filter.type"
              label={<Trans>Legal entity type</Trans>}
              placeholder={translation}
              items={Object.keys(dict).filter(key => key !== "MIS")}
              itemToString={item => dict[item] || translation}
              variant="select"
              emptyOption
            />
          )}
        </Composer>
      </Box>
      <Box px={1} width={1 / 4}>
        <Composer
          components={[
            <DictionaryValue name="LEGAL_ENTITY_STATUS" />,
            ({ render }) => <Trans id="All statuses" render={render} />
          ]}
        >
          {([dict, { translation }]) => (
            <Field.Select
              name="filter.nhsVerified"
              label={<Trans>Verification status</Trans>}
              placeholder={translation}
              items={Object.keys(dict)}
              itemToString={item => dict[item] || translation}
              variant="select"
              emptyOption
            />
          )}
        </Composer>
      </Box>
    </Flex>
    <Flex mx={-1} justifyContent="flex-start">
      <Box px={1}>
        <Button variant="blue">
          <Trans>Search</Trans>
        </Button>
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
          <Trans>Reset</Trans>
        </IconButton>
      </Box>
    </Flex>
  </Form>
);

const resetValue = createDecorator(
  {
    field: "filter.code",
    updates: {
      "filter.settlement": (value, { filter = {} }) => {
        return value ? undefined : filter.settlement;
      },
      "filter.nhsVerified": (value, { filter = {} }) => {
        return value ? undefined : filter.nhsVerified;
      }
    }
  },
  {
    field: "filter.settlement",
    updates: {
      "filter.code": (value, { filter = {} }) => {
        return value ? undefined : filter.code;
      }
    }
  },
  {
    field: "filter.nhsVerified",
    updates: {
      "filter.code": (value, { filter = {} }) => {
        return value ? undefined : filter.code;
      }
    }
  }
);
