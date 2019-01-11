import React from "react";
import isEmpty from "lodash/isEmpty";
import { Flex, Box, Heading } from "rebass/emotion";
import { Query } from "react-apollo";
import system from "system-components/emotion";
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
  parsePhone,
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
import { ITEMS_PER_PAGE } from "../../constants/pagination";

const SearchPersonsQuery = loader("../../graphql/SearchPersonsQuery.graphql");

const PHONE_PATTERN = "^\\+380\\d{9}$";
const EDRPOU_PATTERN = "^[0-9]{10}$";

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
          filter: { documents, personal } = {},
          first,
          last,
          after,
          before,
          orderBy
        } = locationParams;

        return (
          <>
            <SearchByPersonDataForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
            />
            <Query
              skip={isEmpty(documents) || isEmpty(personal)}
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
                  documents,
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
                            action: <Trans>Action</Trans>
                          }}
                          renderRow={({
                            id,
                            birthDate,
                            taxId,
                            authenticationMethods,
                            insertedAt,
                            ...person
                          }) => ({
                            ...person,
                            fullName: getFullName(person),
                            birthDate: formatDate(birthDate),
                            taxId: taxId || "—",
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
                              <AuthnMethodsList data={authenticationMethods} />
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
    onSubmit={params =>
      onSubmit({
        ...params,
        ...resetPaginationParams(initialValues.first)
      })
    }
  >
    <Flex mx={-1}>
      <Box width={2 / 5}>
        <Box px={1}>
          <Trans
            id="Enter INN"
            render={({ translation }) => (
              <Field.Text
                name="filter.documents.taxId"
                label={<Trans>INN</Trans>}
                placeholder={translation}
              />
            )}
          />
          <Validation.Matches
            field="filter.documents.taxId"
            options={EDRPOU_PATTERN}
            message={<Trans>Invalid tax id</Trans>}
          />
        </Box>
        <Box px={1}>
          <Field.Text
            name="filter.documents.number"
            label={<Trans>Passport number</Trans>}
            placeholder="MM123456"
          />
        </Box>
      </Box>
      <Divider />
      <DependedField name="filter.documents" subscription={{ value: true }}>
        {({ input: { value } }) => (
          <Box width={2 / 5}>
            <Box px={1}>
              <Field.Text
                name="filter.personal.authenticationMethod.phoneNumber"
                label={<Trans>Phone number</Trans>}
                placeholder="+38"
                format={formatPhone}
                parse={parsePhone}
                disabled={!value}
              />
              <Validation.Matches
                field="filter.personal.authenticationMethod.phoneNumber"
                options={PHONE_PATTERN}
                message={<Trans>Invalid phone number</Trans>}
              />
            </Box>
            <Box px={1} width={3 / 5}>
              <Field.DatePicker
                name="filter.personal.birthDate"
                label={<Trans>Date of birth</Trans>}
                minDate="01-01-1900"
                disabled={!value}
              />
            </Box>
          </Box>
        )}
      </DependedField>
      <DependedField.Listener
        field="filter.documents"
        set="filter.personal"
        to={initialValues.filter ? initialValues.filter.personal : ""}
      />
    </Flex>
    <Flex mx={-1} justifyContent="flex-start">
      <Box px={1}>
        <DependedField name="filter" subscription={{ value: true }}>
          {({ input: { value } }) => (
            <Button
              variant="blue"
              disabled={isEmpty(value.documents) || isEmpty(value.personal)}
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

const AuthnMethodsList = ({ data }) => (
  <Flex as="ul" flexDirection="column">
    {data.map(({ type, phoneNumber }, idx) => (
      <Box
        key={idx}
        as="li"
        mb={1}
        css={{ "&:last-child": { marginBottom: 0 } }}
      >
        {type !== "NA" ? (
          <>
            <div>{type}</div>
            {phoneNumber && <div>{phoneNumber}</div>}
          </>
        ) : (
          "—"
        )}
      </Box>
    ))}
  </Flex>
);

const Divider = system({
  mx: 5,
  width: "1px",
  bg: "januaryDawn"
});
