import React from "react";
import isEmpty from "lodash/isEmpty";
import { Flex, Box, Heading } from "@rebass/emotion";
import { Query } from "react-apollo";
import system from "@ehealth/system-components";
import { loader } from "graphql.macro";
import { Trans, DateFormat } from "@lingui/macro";
import {
  Form,
  Validation,
  LocationParams,
  Field as DependedField
} from "@ehealth/components";
import {
  parseSortingParams,
  stringifySortingParams,
  formatPhone,
  getFullName,
  formatDate
} from "@ehealth/utils";
import { RemoveItemIcon } from "@ehealth/icons";

import Link from "../../components/Link";
import LoadingOverlay from "../../components/LoadingOverlay";
import Table from "../../components/Table";
import * as Field from "../../components/Field";
import Button, { IconButton } from "../../components/Button";
import Pagination from "../../components/Pagination";
import Badge from "../../components/Badge";
import AuthMethodsList from "../../components/AuthMethodsList";
import DictionaryValue from "../../components/DictionaryValue";
import { ITEMS_PER_PAGE } from "../../constants/pagination";

const SearchPersonsQuery = loader("../../graphql/SearchPersonsQuery.graphql");

const PHONE_PATTERN = "^\\+380\\d{9}$";
const EDRPOU_PATTERN = "^[0-9]{10}$";
const UNZR_PATTERN = "^[0-9]{8}-[0-9]{5}$";

const resetPaginationParams = first => ({
  after: undefined,
  before: undefined,
  last: undefined,
  first: first || ITEMS_PER_PAGE[0]
});

const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      <Trans>Patient Search</Trans>
    </Heading>
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          filter: { identity, personal } = {},
          first,
          last,
          after,
          before,
          orderBy
        } = locationParams;
        const { number, type, ...documents } = identity || {};

        return (
          <>
            <SearchByPersonDataForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
            />
            <Query
              skip={isEmpty(identity) || isEmpty(personal)}
              fetchPolicy="network-only"
              query={SearchPersonsQuery}
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
                filter: {
                  identity: {
                    ...documents,
                    document: number
                      ? {
                          type: type,
                          number
                        }
                      : undefined
                  },
                  personal
                }
              }}
            >
              {({ loading, error, data }) => {
                if (error || isEmpty(data)) return null;
                const { nodes: persons = [], pageInfo } = data.persons;

                return (
                  <LoadingOverlay loading={loading}>
                    {persons.length > 0 && (
                      <>
                        <Table
                          data={persons}
                          header={{
                            fullName: <Trans>Patient Name</Trans>,
                            birthDate: <Trans>Date of birth</Trans>,
                            taxId: <Trans>INN</Trans>,
                            unzr: <Trans>Record ID in EDDR</Trans>,
                            authenticationMethods: (
                              <Trans>Authentication method</Trans>
                            ),
                            insertedAt: <Trans>Added</Trans>,
                            status: <Trans>Status</Trans>,
                            action: <Trans>Action</Trans>
                          }}
                          renderRow={({
                            id,
                            birthDate,
                            taxId,
                            unzr,
                            authenticationMethods,
                            insertedAt,
                            status,
                            ...person
                          }) => ({
                            ...person,
                            fullName: getFullName(person),
                            birthDate: formatDate(birthDate),
                            taxId: taxId || "—",
                            unzr: unzr || "—",
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
                            authenticationMethods: (
                              <AuthMethodsList data={authenticationMethods} />
                            ),
                            status: (
                              <Badge
                                type="PERSON"
                                name={status}
                                display="block"
                              />
                            ),
                            action: (
                              <Link to={`../${id}`} fontWeight="bold">
                                <Trans>Show details</Trans>
                              </Link>
                            )
                          })}
                          sortableFields={[
                            "birthDate",
                            "taxId",
                            "unzr",
                            "insertedAt"
                          ]}
                          sortingParams={parseSortingParams(
                            locationParams.orderBy
                          )}
                          onSortingChange={sortingParams =>
                            setLocationParams({
                              ...locationParams,
                              orderBy: stringifySortingParams(sortingParams)
                            })
                          }
                          tableName="persons/search"
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

const SearchByPersonDataForm = ({ initialValues, onSubmit }) => (
  <Form
    initialValues={initialValues}
    onSubmit={({ filter: { identity, personal }, ...params }) => {
      const { number, type, ...documents } = identity;
      return onSubmit({
        ...params,
        ...resetPaginationParams(initialValues.first),
        filter: {
          identity: {
            type: number ? type : undefined,
            number: number,
            ...documents
          },
          personal
        }
      });
    }}
  >
    <Flex mx={-1}>
      <Box width={2 / 5}>
        <Flex>
          <Box px={1} width={1 / 2}>
            <Trans
              id="Enter INN"
              render={({ translation }) => (
                <Field.Text
                  name="filter.identity.taxId"
                  label={<Trans>INN</Trans>}
                  placeholder={translation}
                  maxLength={10}
                />
              )}
            />
            <Validation.Matches
              field="filter.identity.taxId"
              options={EDRPOU_PATTERN}
              message={<Trans>Invalid tax id</Trans>}
            />
          </Box>
          <Box px={1} width={1 / 2}>
            <Trans
              id="Enter UNZR"
              render={({ translation }) => (
                <Field.Text
                  name="filter.identity.unzr"
                  label={<Trans>UNZR</Trans>}
                  placeholder={translation}
                  maxLength={14}
                />
              )}
            />
            <Validation.Matches
              field="filter.identity.unzr"
              options={UNZR_PATTERN}
              message={<Trans>Invalid number</Trans>}
            />
          </Box>
        </Flex>
        <Flex>
          <Box px={1} width={1 / 2}>
            <Trans
              id="Enter document number"
              render={({ translation }) => (
                <DependedField
                  name="filter.identity.type"
                  subscription={{ value: true }}
                >
                  {({ input: { value } }) => {
                    const { pattern, maxLength } = getValidationPattern(value);

                    return (
                      <>
                        <Field.Text
                          name="filter.identity.number"
                          label={<Trans>Document number</Trans>}
                          placeholder={translation}
                          disabled={!value}
                          maxLength={maxLength}
                          width="100%"
                        />
                        <Validation.Matches
                          field="filter.identity.number"
                          options={pattern}
                          message={<Trans>Invalid number</Trans>}
                        />
                      </>
                    );
                  }}
                </DependedField>
              )}
            />
            <DependedField.Listener
              field="filter.identity.type"
              set="filter.identity.number"
              to=""
            />
          </Box>
          <Box px={1} width={1 / 2}>
            <DictionaryValue name="DOCUMENT_TYPE">
              {documentTypes => (
                <Trans
                  id="Select document type"
                  render={({ translation }) => (
                    <Field.Select
                      name="filter.identity.type"
                      label="&nbsp;"
                      items={Object.keys(documentTypes)}
                      itemToString={item => documentTypes[item] || translation}
                      variant="select"
                      emptyOption
                    />
                  )}
                />
              )}
            </DictionaryValue>
          </Box>
        </Flex>
      </Box>
      <Divider />
      <DependedField name="filter.identity" subscription={{ value: true }}>
        {({ input: { value } }) => {
          const identity = Object.keys(value).filter(
            item => value[item] && item !== "type"
          );
          return (
            <Box width={2 / 5}>
              <Box px={1}>
                <Field.Text
                  name="filter.personal.authenticationMethod.phoneNumber"
                  label={<Trans>Phone number</Trans>}
                  format={formatPhone}
                  parse={parsePhone}
                  disabled={isEmpty(identity)}
                />
                <Validation.Matches
                  field="filter.personal.authenticationMethod.phoneNumber"
                  options={PHONE_PATTERN}
                  message={<Trans>Invalid phone number</Trans>}
                />
              </Box>
              <Box px={1} width={1 / 2}>
                <Field.DatePicker
                  name="filter.personal.birthDate"
                  label={<Trans>Date of birth</Trans>}
                  minDate="1900-01-01"
                  disabled={isEmpty(identity)}
                />
              </Box>
            </Box>
          );
        }}
      </DependedField>
    </Flex>
    <Flex mx={-1} justifyContent="flex-start">
      <Box px={1}>
        <DependedField name="filter" subscription={{ value: true }}>
          {({
            input: {
              value: {
                identity = {},
                personal = {},
                personal: {
                  authenticationMethod: { phoneNumber = {} } = {}
                } = {}
              }
            }
          }) => (
            <Button
              variant="blue"
              disabled={
                (isEmpty(identity.number) &&
                  isEmpty(identity.taxId) &&
                  isEmpty(identity.unzr)) ||
                (isEmpty(phoneNumber) && isEmpty(personal.birthDate))
              }
            >
              <Trans>Search</Trans>
            </Button>
          )}
        </DependedField>
      </Box>
      <Box px={1}>
        <IconButton
          icon={RemoveItemIcon}
          type="reset"
          disabled={isEmpty(initialValues.filter)}
          onClick={() => {
            onSubmit({
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

const parsePhone = phone => {
  const parsedPhone = `+${phone.replace(/[^\d]/g, "").substr(0, 12)}`;
  return parsedPhone.length < 4 ? undefined : parsedPhone;
};

const getValidationPattern = data => {
  switch (data) {
    case "BIRTH_CERTIFICATE":
    case "TEMPORARY_PASSPORT": {
      return {
        pattern: "^(?![ЫЪЭЁыъэё@%&$^#`~:,.*|}{?!])[A-ZА-ЯҐЇІЄ0-9№/()-]+$",
        maxLength: 25
      };
    }
    case "NATIONAL_ID": {
      return {
        pattern: "^[0-9]{9}$",
        maxLength: 9
      };
    }
    default: {
      return {
        pattern: "^((?![ЫЪЭЁ])([А-ЯҐЇІЄ])){2}[0-9]{6}$",
        maxLength: 8
      };
    }
  }
};

const Divider = system(
  {
    mx: 5,
    width: "1px",
    bg: "januaryDawn"
  },
  "color",
  "width",
  "space"
);
