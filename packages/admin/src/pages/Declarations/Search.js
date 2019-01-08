import React from "react";
import isEmpty from "lodash/isEmpty";
import { Flex, Box, Heading } from "@rebass/emotion";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
import { Trans, DateFormat } from "@lingui/macro";
import { Form, Validation, LocationParams } from "@ehealth/components";
import {
  parseSortingParams,
  stringifySortingParams,
  getFullName
} from "@ehealth/utils";
import { AdminSearchIcon, RemoveItemIcon, NegativeIcon } from "@ehealth/icons";

import Link from "../../components/Link";
import Badge from "../../components/Badge";
import LoadingOverlay from "../../components/LoadingOverlay";
import Table from "../../components/Table";
import * as Field from "../../components/Field";
import Button, { IconButton } from "../../components/Button";
import Pagination from "../../components/Pagination";
import AddressView from "../../components/AddressView";
import { ITEMS_PER_PAGE } from "../../constants/pagination";
import { DECLARATION_NUMBER_PATTERN } from "../../constants/declarationSearchPatterns";

const SearchDeclarationsQuery = loader(
  "../../graphql/SearchDeclarationsQuery.graphql"
);

const resetPaginationParams = first => ({
  after: undefined,
  before: undefined,
  last: undefined,
  first: first || ITEMS_PER_PAGE[0]
});

const Search = ({ uri }) => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      <Trans>Search for Declarations</Trans>
    </Heading>

    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          filter: { declarationNumber } = {},
          first,
          last,
          after,
          before,
          orderBy
        } = locationParams;

        return (
          <>
            <SearchDeclarationForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
            />
            <Query
              query={SearchDeclarationsQuery}
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
                filter: { declarationNumber }
              }}
            >
              {({ loading, error, data }) => {
                if (error || isEmpty(data)) return null;
                const {
                  nodes: declarations = [],
                  pageInfo
                } = data.declarations;

                return (
                  <LoadingOverlay loading={loading}>
                    {declarations.length > 0 && (
                      <>
                        <Table
                          data={declarations}
                          header={{
                            databaseId: <Trans>Declaration ID</Trans>,
                            declarationNumber: (
                              <Trans>Declaration number</Trans>
                            ),
                            startDate: <Trans>Declaration start date</Trans>,
                            legalEntityName: <Trans>Legal entity</Trans>,
                            legalEntityEdrpou: <Trans>EDRPOU</Trans>,
                            divisionName: <Trans>Division name</Trans>,
                            divisionAddress: <Trans>Address</Trans>,
                            status: <Trans>Status</Trans>,
                            noTaxId: <Trans>No tax ID</Trans>,
                            patientName: <Trans>Patient Name</Trans>,
                            action: <Trans>Action</Trans>
                          }}
                          renderRow={({
                            id,
                            legalEntity,
                            startDate,
                            division,
                            person,
                            status,
                            noTaxId,
                            ...declaration
                          }) => ({
                            ...declaration,
                            legalEntityName: legalEntity.name,
                            legalEntityEdrpou: legalEntity.edrpou,
                            patientName: getFullName(person),
                            divisionName: division.name,
                            divisionAddress: division.addresses
                              .filter(address => address.type === "RESIDENCE")
                              .map((item, key) => (
                                <AddressView data={item} key={key} />
                              )),
                            startDate: <DateFormat value={startDate} />,
                            status: (
                              <Badge
                                name={status}
                                type="DECLARATION"
                                minWidth={100}
                              />
                            ),
                            noTaxId: (
                              <Flex justifyContent="center">
                                {noTaxId ? (
                                  <NegativeIcon
                                    fill="#ED1C24"
                                    stroke="#ED1C24"
                                  />
                                ) : (
                                  <NegativeIcon />
                                )}
                              </Flex>
                            ),
                            action: (
                              <Link to={`../${id}`} fontWeight="bold">
                                <Trans>Show details</Trans>
                              </Link>
                            )
                          })}
                          sortableFields={["startDate", "status", "noTaxId"]}
                          sortingParams={parseSortingParams(
                            locationParams.orderBy
                          )}
                          onSortingChange={sortingParams =>
                            setLocationParams({
                              orderBy: stringifySortingParams(sortingParams)
                            })
                          }
                          tableName="declarations/search"
                          whiteSpaceNoWrap={["databaseId"]}
                          hiddenFields="noTaxId,patientName,databaseId"
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

const SearchDeclarationForm = ({ initialValues, onSubmit }) => (
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
      <Box px={1} width={1 / 2}>
        <Trans
          id="Enter declaration number"
          render={({ translation }) => (
            <Field.Text
              name="filter.declarationNumber"
              label={<Trans>Search by declaration number</Trans>}
              placeholder={translation}
              postfix={<AdminSearchIcon color="#CED0DA" />}
              autoComplete="off"
            />
          )}
        />
        <Validation.Matches
          field="filter.declarationNumber"
          options={DECLARATION_NUMBER_PATTERN}
          message={<Trans>Invalid number</Trans>}
        />
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
