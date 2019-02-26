import React from "react";
import { isEmpty, isEqual } from "lodash";
import { Flex, Box, Heading } from "@rebass/emotion";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
import { Trans, DateFormat } from "@lingui/macro";
import { Form, LocationParams } from "@ehealth/components";
import {
  parseSortingParams,
  stringifySortingParams,
  getFullName
} from "@ehealth/utils";
import { PositiveIcon, NegativeIcon } from "@ehealth/icons";

import Link from "../../components/Link";
import Badge from "../../components/Badge";
import LoadingOverlay from "../../components/LoadingOverlay";
import Table from "../../components/Table";
import * as Field from "../../components/Field";
import Pagination from "../../components/Pagination";
import AddressView from "../../components/AddressView";
import STATUSES from "../../helpers/statuses";
import { ITEMS_PER_PAGE } from "../../constants/pagination";

const SearchPendingDeclarationsQuery = loader(
  "../../graphql/SearchPendingDeclarationsQuery.graphql"
);

const Search = () => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      <Trans>Pending declarations</Trans>
    </Heading>

    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          filter: { reason } = {},
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
              query={SearchPendingDeclarationsQuery}
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
                filter: { reason }
              }}
            >
              {({
                loading,
                error,
                data: {
                  pendingDeclarations: { nodes: declarations, pageInfo } = {}
                }
              }) => {
                if (isEmpty(declarations)) return null;
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
                            reason: <Trans>No tax ID</Trans>,
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
                            reason,
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
                            reason: (
                              <Flex justifyContent="center">
                                {reason === "no_tax_id" ? (
                                  <PositiveIcon />
                                ) : (
                                  <NegativeIcon />
                                )}
                              </Flex>
                            ),
                            action: (
                              <Link
                                to={`../../declarations/${id}`}
                                fontWeight="bold"
                              >
                                <Trans>Show details</Trans>
                              </Link>
                            )
                          })}
                          sortableFields={["startDate", "status", "reason"]}
                          sortingParams={parseSortingParams(
                            locationParams.orderBy
                          )}
                          onSortingChange={sortingParams =>
                            setLocationParams({
                              orderBy: stringifySortingParams(sortingParams)
                            })
                          }
                          tableName="pending-declarations/search"
                          whiteSpaceNoWrap={["databaseId"]}
                          hiddenFields="reason,patientName,databaseId"
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

const SearchDeclarationForm = ({ initialValues, onSubmit }) => {
  return (
    <Form onSubmit={() => null} initialValues={initialValues}>
      <Form.AutoSubmit
        onSubmit={params =>
          !isEqual(params.filter, initialValues.filter) &&
          onSubmit({
            ...params,
            ...resetPaginationParams(initialValues.first)
          })
        }
      />
      <Flex mx={-1}>
        <Box px={1} width={1 / 3}>
          <Trans
            id="Show all"
            render={({ translation }) => (
              <Field.Select
                name="filter.reason"
                label={<Trans>Patient IPN</Trans>}
                items={Object.keys(STATUSES.REASON)}
                itemToString={item => STATUSES.REASON[item] || translation}
                emptyOption
                variant="select"
              />
            )}
          />
        </Box>
      </Flex>
    </Form>
  );
};

const resetPaginationParams = first => ({
  after: undefined,
  before: undefined,
  last: undefined,
  first: first || ITEMS_PER_PAGE[0]
});
