import React from "react";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
import { DateFormat, Trans } from "@lingui/macro";
import { Box, Flex } from "@rebass/emotion";
import { Validation, LocationParams } from "@ehealth/components";
import {
  getFullName,
  parseSortingParams,
  stringifySortingParams
} from "@ehealth/utils";
import { SearchIcon } from "@ehealth/icons";
import Table from "../../../components/Table";
import Badge from "../../../components/Badge";
import Link from "../../../components/Link";
import Pagination from "../../../components/Pagination";
import * as Field from "../../../components/Field";
import AssigneeSearch from "../../../components/AssigneeSearch";
import LoadingOverlay from "../../../components/LoadingOverlay";
import SearchForm from "../../../components/SearchForm";
import { SEARCH_REQUEST_PATTERN } from "../../../constants/contractRequests";
import { ITEMS_PER_PAGE } from "../../../constants/pagination";
import STATUSES from "../../../helpers/statuses";
import contractFormFilteredParams from "../../../helpers/contractFormFilteredParams";

import ContractRequestsNav from "../ContractRequestsNav";

const SearchReimbursementContractRequestsQuery = loader(
  "../../../graphql/SearchReimbursementContractRequestsQuery.graphql"
);
const MedicalProgramsQuery = loader(
  "../../../graphql/MedicalProgramsQuery.graphql"
);
const SearchContractsByLegalEntitiesQuery = loader(
  "../../../graphql/SearchContractsByLegalEntitiesQuery.graphql"
);

const ReimbursementContractRequestsSearch = () => (
  <Box p={6}>
    <ContractRequestsNav />
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { filter, first, last, after, before, orderBy } = locationParams;
        return (
          <>
            <SearchForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
              renderPrimary={PrimarySearchFields}
              renderSecondary={SecondarySearchFields}
            />
            <Query
              query={SearchReimbursementContractRequestsQuery}
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
                filter: contractFormFilteredParams(filter)
              }}
            >
              {({
                loading,
                error,
                data: {
                  reimbursementContractRequests: {
                    nodes: reimbursementContractRequests = [],
                    pageInfo
                  } = {}
                }
              }) => {
                if (isEmpty(reimbursementContractRequests)) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    {reimbursementContractRequests.length > 0 && (
                      <>
                        <Table
                          data={reimbursementContractRequests}
                          header={{
                            databaseId: (
                              <Trans>Contract request databaseID</Trans>
                            ),
                            edrpou: <Trans>EDRPOU</Trans>,
                            contractorLegalEntityName: (
                              <Trans>Name of medical institution</Trans>
                            ),
                            contractNumber: <Trans>Contract Number</Trans>,
                            startDate: (
                              <Trans>The contract is valid with</Trans>
                            ),
                            endDate: <Trans>The contract is valid for</Trans>,
                            assigneeName: <Trans>Performer</Trans>,
                            medicalProgram: <Trans>Medical program</Trans>,
                            insertedAt: <Trans>Added</Trans>,
                            status: <Trans>Status</Trans>,
                            details: <Trans>Details</Trans>
                          }}
                          renderRow={({
                            id,
                            status,
                            startDate,
                            endDate,
                            contractorLegalEntity: {
                              edrpou,
                              name: contractorLegalEntityName
                            },
                            assignee,
                            insertedAt,
                            medicalProgram,
                            ...reimbursementContractRequests
                          }) => ({
                            ...reimbursementContractRequests,
                            edrpou,
                            contractorLegalEntityName,
                            medicalProgram:
                              medicalProgram && medicalProgram.name,
                            startDate: <DateFormat value={startDate} />,
                            endDate: <DateFormat value={endDate} />,
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
                            assigneeName: assignee
                              ? getFullName(assignee.party)
                              : undefined,
                            status: (
                              <Badge
                                type="CONTRACT_REQUEST"
                                name={status}
                                display="block"
                              />
                            ),
                            details: (
                              <Link to={`./${id}`} fontWeight="bold">
                                <Trans>Show details</Trans>
                              </Link>
                            )
                          })}
                          sortableFields={[
                            "status",
                            "startDate",
                            "endDate",
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
                          tableName="reimbursementContractRequests/search"
                          whiteSpaceNoWrap={["databaseId"]}
                          hiddenFields="contractorLegalEntityName,insertedAt"
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

const PrimarySearchFields = () => (
  <Flex mx={-1}>
    <Box px={1} width={1 / 3}>
      <Trans
        id="EDRPOU or Contract number"
        render={({ translation }) => (
          <Field.Text
            name="filter.searchRequest"
            label={<Trans>Search contract request</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
          />
        )}
      />
      <Validation.Matches
        field="filter.searchRequest"
        options={SEARCH_REQUEST_PATTERN}
        message="Invalid number"
      />
    </Box>

    <Box px={1} width={1 / 3}>
      <AssigneeSearch />
    </Box>
    <Box px={1} width={1 / 3}>
      <Trans
        id="All statuses"
        render={({ translation }) => (
          <Field.Select
            name="filter.status"
            label={<Trans>Contract Request status</Trans>}
            placeholder={translation}
            items={Object.keys(STATUSES.CONTRACT_REQUEST)}
            itemToString={item =>
              STATUSES.CONTRACT_REQUEST[item] || translation
            }
            variant="select"
            emptyOption
          />
        )}
      />
    </Box>
  </Flex>
);

const SecondarySearchFields = () => (
  <>
    <Flex>
      <Box mr={1} width={1 / 3}>
        <Field.RangePicker
          rangeNames={["filter.date.startFrom", "filter.date.startTo"]}
          label={<Trans>Contract start date</Trans>}
        />
      </Box>
      <Box width={1 / 3}>
        <Field.RangePicker
          rangeNames={["filter.date.endFrom", "filter.date.endTo"]}
          label={<Trans>Contract end date</Trans>}
        />
      </Box>
      <Box width={1 / 3}>
        <Field.RangePicker
          rangeNames={[
            "filter.date.insertedAtFrom",
            "filter.date.insertedAtTo"
          ]}
          label={<Trans>Contract inserted date</Trans>}
        />
      </Box>
    </Flex>
    <Flex mx={-1}>
      <Box px={1} width={1 / 3}>
        <Trans
          id="Choose medical program"
          render={({ translation }) => (
            <Query
              query={MedicalProgramsQuery}
              fetchPolicy="cache-first"
              variables={{
                skip: true
              }}
            >
              {({
                loading,
                error,
                data: {
                  medicalPrograms: { nodes: medicalPrograms = [] } = {}
                } = {},
                refetch: refetchMedicalProgram
              }) => {
                return (
                  <Field.Select
                    name="filter.medicalProgram.name"
                    label={<Trans>Medical program</Trans>}
                    placeholder={translation}
                    items={medicalPrograms.map(({ name }) => name)}
                    onInputValueChange={debounce(
                      program =>
                        !isEmpty(program) &&
                        refetchMedicalProgram({
                          skip: false,
                          first: 20,
                          filter: { name: program }
                        }),
                      1000
                    )}
                  />
                );
              }}
            </Query>
          )}
        />
      </Box>
      <Box px={1} width={1 / 3}>
        <Trans
          id="Enter legal entity name"
          render={({ translation }) => (
            <Query
              query={SearchContractsByLegalEntitiesQuery}
              variables={{ skip: true }}
            >
              {({
                data: {
                  legalEntities: { nodes: legalEntities = [] } = {}
                } = {},
                refetch: refetchlegalEntities
              }) => (
                <Field.Select
                  name="filter.contractorLegalEntity"
                  label={<Trans>Legal entity name</Trans>}
                  placeholder={translation}
                  items={legalEntities.map(({ name }) => ({ name }))}
                  onInputValueChange={debounce(
                    (legalEntity, { selectedItem, inputValue }) => {
                      const name = selectedItem && selectedItem.name;
                      return (
                        name !== inputValue &&
                        refetchlegalEntities({
                          skip: false,
                          first: 20,
                          filter: {
                            name: legalEntity,
                            type: ["MSP", "MSP_PHARMACY"]
                          }
                        })
                      );
                    },
                    1000
                  )}
                  itemToString={item => item && item.name}
                  filterOptions={{ keys: ["name"] }}
                />
              )}
            </Query>
          )}
        />
      </Box>
    </Flex>
  </>
);

export default ReimbursementContractRequestsSearch;
