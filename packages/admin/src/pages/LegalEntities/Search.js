import React from "react";
import { Flex, Box, Heading } from "rebass/emotion";
import { Router, Redirect } from "@reach/router";
import { Query } from "react-apollo";
import {
  Form,
  LocationParams,
  Validations,
  Validation
} from "@ehealth/components";
import {
  parseSortingParams,
  stringifySortingParams,
  formatPhone,
  parsePhone,
  getFullName,
  formatDate
} from "@ehealth/utils";
import { PositiveIcon, AdminSearchIcon } from "@ehealth/icons";
import { getIn } from "final-form";
import createDecorator from "final-form-calculate";

import { titleCase } from "@ehealth/utils";

import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";

import * as Field from "../../components/Field";

import SearchLegalEntitiesQuery from "../../graphql/SearchLegalEntitiesQuery.graphql";
import SettlementsQuery from "../../graphql/SettlementsQuery.graphql";
import Details from "../../components/Details";
import Table from "../../components/Table";
import Link from "../../components/Link";
import AddressView from "../../components/AddressView";
import StatusBlock from "../../components/StatusBlock";

import STATUSES from "../../helpers/statuses";

const legalEntityStatus = Object.entries(STATUSES.LEGAL_ENTITY_STATUS).map(
  ([key, value]) => ({
    key: key === "VERIFIED",
    value
  })
);
const ID_PATTERN =
  "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";

const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      Пошук медзакладів
    </Heading>

    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          filter: { code, settlement, nhsVerified, ...filterRest } = {}
        } = locationParams;
        const regId = new RegExp(ID_PATTERN);
        const testID = regId.test(code);
        const sendCodeParams = testID ? { id: code } : { edrpou: code };

        const filteredParams = {
          ...sendCodeParams,
          nhsVerified: isEmpty(nhsVerified) ? undefined : nhsVerified.key,
          settlement: isEmpty(settlement) ? undefined : settlement.settlement,
          area: isEmpty(settlement) ? undefined : settlement.area
        };

        return (
          <>
            <SearchLegalEntitiesForm
              initialValues={locationParams}
              setLocationParams={setLocationParams}
            />
            <Query
              query={SearchLegalEntitiesQuery}
              variables={{
                ...locationParams,
                filter: !isEmpty(locationParams.filter)
                  ? filteredParams
                  : undefined
              }}
            >
              {({ loading, error, data: { legalEntities = [] } }) =>
                !error && legalEntities.length > 0 ? (
                  <Table
                    data={legalEntities}
                    header={{
                      id: "ID",
                      name: "Назва Медзакладу",
                      edrpou: "ЄДРПОУ",
                      addresses: "Адреса",
                      nhsVerified: "Верифікований НСЗУ",
                      status: "Статус",
                      action: "Дія"
                    }}
                    renderRow={({
                      addresses,
                      nhsVerified,
                      status,
                      ...legalEntity
                    }) => ({
                      ...legalEntity,
                      nhsVerified: nhsVerified && <PositiveIcon />,
                      status: <StatusBlock type="LEGALENTITY" name={status} />,
                      addresses: (
                        <>
                          {addresses
                            .filter(a => a.type === "ACTIVE")
                            .map(item => (
                              <AddressView data={item} />
                            ))}
                        </>
                      ),
                      action: (
                        <Link to={`../${legalEntity.id}`} fontWeight="bold">
                          Показати деталі
                        </Link>
                      )
                    })}
                    sortableFields={["edrpou", "status"]}
                    sortingParams={parseSortingParams(locationParams.orderBy)}
                    onSortingChange={sortingParams =>
                      setLocationParams({
                        ...locationParams,
                        orderBy: stringifySortingParams(sortingParams)
                      })
                    }
                  />
                ) : null
              }
            </Query>
          </>
        );
      }}
    </LocationParams>
  </Box>
);

export default Search;

const SearchLegalEntitiesForm = ({ initialValues, setLocationParams }) => {
  const {
    filter: { settlement: { settlement = "" } = {} } = {}
  } = initialValues;
  return (
    <Form
      onSubmit={() => null /* NOT USED, but required */}
      initialValues={initialValues}
      decorators={[resetValue]}
    >
      <Form.AutoSubmit onSubmit={setLocationParams} />
      <Flex mx={-1}>
        <Box px={1} width={1 / 2}>
          <Field.Text
            name="filter.code"
            label="Пошук медзакладу за ЄДРПОУ"
            placeholder="ЄДРПОУ або ID медзакладу"
            postfix={<AdminSearchIcon color="#CED0DA" />}
          />
        </Box>
      </Flex>
      <Flex mx={-1}>
        <Box px={1} width={1 / 3}>
          <Query
            query={SettlementsQuery}
            fetchPolicy="cache-first"
            variables={{ name: "" }}
            context={{ credentials: "same-origin" }}
          >
            {({ loading, error, data: { settlements = [{}] }, refetch }) => {
              return (
                <Field.Select
                  name="filter.settlement"
                  label="Населений пункт"
                  placeholder="Введіть населений пункт"
                  itemToString={item => {
                    if (!item) return "";
                    return typeof item === "string" ? item : item.settlement;
                  }}
                  items={settlements.map(
                    ({ name, district, type, region }) => ({
                      area: region || undefined,
                      settlement: name,
                      settlementType: type,
                      region: district || undefined
                    })
                  )}
                  onInputValueChange={debounce(
                    settlement => refetch({ name: settlement }),
                    500
                  )}
                  filterOptions={{ keys: ["settlement"] }}
                  renderItem={address => <AddressView data={address} />}
                  size="small"
                />
              );
            }}
          </Query>
        </Box>

        <Box px={1} width={1 / 3}>
          {/*Todo: Use Select with dictionary LEGAL_ENTITY_STATUS*/}
          <Field.Select
            type="select"
            name="filter.nhsVerified"
            label="Статус верифікації"
            placeholder="Оберіть статус верифікації"
            itemToString={({ value }) => value}
            items={legalEntityStatus}
            renderItem={({ value }) => value}
            size="small"
          />
        </Box>
      </Flex>
    </Form>
  );
};

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