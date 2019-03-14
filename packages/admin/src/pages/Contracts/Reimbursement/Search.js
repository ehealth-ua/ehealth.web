import React from "react";
import { Flex, Box } from "@rebass/emotion";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import debounce from "lodash/debounce";
import { loader } from "graphql.macro";
import { DateFormat, Trans } from "@lingui/macro";

import { Validation, LocationParams } from "@ehealth/components";
import {
  getFullName,
  parseSortingParams,
  stringifySortingParams
} from "@ehealth/utils";
import { SearchIcon, NegativeIcon } from "@ehealth/icons";
import * as Field from "../../../components/Field";
import Link from "../../../components/Link";
import Table from "../../../components/Table";
import Pagination from "../../../components/Pagination";
import LoadingOverlay from "../../../components/LoadingOverlay";
import Badge from "../../../components/Badge";
import SearchForm from "../../../components/SearchForm";
import STATUSES from "../../../helpers/statuses";
import { SEARCH_CONTRACT_PATTERN } from "../../../constants/contracts";
import { ITEMS_PER_PAGE } from "../../../constants/pagination";
import contractFormFilteredParams from "../../../helpers/contractFormFilteredParams";
import ContractsNav from "../ContractsNav";

const SearchReimbursementContractsQuery = loader(
  "../../../graphql/SearchReimbursementContractsQuery.graphql"
);
const MedicalProgramsQuery = loader(
  "../../../graphql/MedicalProgramsQuery.graphql"
);
const SearchContractsByLegalEntitiesQuery = loader(
  "../../../graphql/SearchContractsByLegalEntitiesQuery.graphql"
);

const ReimbursementContractsSearch = () => (
  <Box p={6}>
    <ContractsNav />
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
              query={SearchReimbursementContractsQuery}
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
                  reimbursementContracts: {
                    nodes: contracts = [],
                    pageInfo
                  } = {}
                }
              }) => {
                if (isEmpty(contracts)) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    {contracts.length > 0 && (
                      <>
                        <Table
                          data={contracts}
                          header={{
                            databaseId: <Trans>ID</Trans>,
                            edrpou: <Trans>EDRPOU</Trans>,
                            name: <Trans>Name of medical institution</Trans>,
                            nhsSignerName: <Trans>Performer</Trans>,
                            contractNumber: <Trans>Contract Number</Trans>,
                            startDate: (
                              <Trans>The contract is valid with</Trans>
                            ),
                            endDate: <Trans>The contract is valid for</Trans>,
                            medicalProgram: <Trans>Medical program</Trans>,
                            isSuspended: <Trans>Contract state</Trans>,
                            insertedAt: <Trans>Added</Trans>,
                            status: <Trans>Status</Trans>,
                            details: <Trans>Details</Trans>
                          }}
                          renderRow={({
                            id,
                            status,
                            isSuspended,
                            startDate,
                            endDate,
                            contractorLegalEntity: { name, edrpou },
                            insertedAt,
                            nhsSigner,
                            medicalProgram,
                            ...contracts
                          }) => ({
                            ...contracts,
                            edrpou,
                            name,
                            nhsSignerName: nhsSigner
                              ? getFullName(nhsSigner.party)
                              : undefined,
                            medicalProgram:
                              medicalProgram && medicalProgram.name,
                            isSuspended: (
                              <Flex justifyContent="center">
                                <NegativeIcon
                                  fill={!isSuspended ? "#1BB934" : "#ED1C24"}
                                  stroke={!isSuspended ? "#1BB934" : "#ED1C24"}
                                />
                              </Flex>
                            ),
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
                            status: (
                              <Badge
                                type="CONTRACT"
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
                            "isSuspended",
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
                          tableName="reimbursement-contract/search"
                          whiteSpaceNoWrap={["databaseId"]}
                          hiddenFields="insertedAt"
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
            label={<Trans>Search contract</Trans>}
            placeholder={translation}
            postfix={<SearchIcon color="silverCity" />}
          />
        )}
      />
      <Validation.Matches
        field="filter.searchRequest"
        options={SEARCH_CONTRACT_PATTERN}
        message="Invalid number"
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
              data: { legalEntities: { nodes: legalEntities = [] } = {} } = {},
              refetch: refetchlegalEntities
            }) => (
              <Field.Select
                name="filter.contractorLegalEntity"
                label={<Trans>Legal entity name</Trans>}
                placeholder={translation}
                items={legalEntities.map(({ name }) => ({ name }))}
                onInputValueChange={debounce(
                  (legalEntity, { selectedItem, inputValue }) =>
                    selectedItem !== inputValue &&
                    refetchlegalEntities({
                      skip: false,
                      first: 20,
                      filter: {
                        name: legalEntity,
                        type: ["PHARMACY", "MSP_PHARMACY"]
                      }
                    }),
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
    <Box px={1} width={1 / 3}>
      <Trans
        id="All statuses"
        render={({ translation }) => (
          <Field.Select
            name="filter.status"
            label={<Trans>Contract status</Trans>}
            placeholder={translation}
            items={Object.keys(STATUSES.CONTRACT)}
            itemToString={item => STATUSES.CONTRACT[item] || translation}
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
    <Flex mx={-1}>
      <Box px={1} width={1 / 3}>
        <Field.RangePicker
          rangeNames={["filter.date.startFrom", "filter.date.startTo"]}
          label={<Trans>Contract start date</Trans>}
        />
      </Box>
      <Box px={1} width={1 / 3}>
        <Field.RangePicker
          rangeNames={["filter.date.endFrom", "filter.date.endTo"]}
          label={<Trans>Contract end date</Trans>}
        />
      </Box>
      <Box width={1 / 3}>
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
                data: {
                  medicalPrograms: { nodes: medicalPrograms = [] } = {}
                } = {},
                refetch: refetchMedicalProgram
              }) => (
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
              )}
            </Query>
          )}
        />
      </Box>
    </Flex>
  </>
);

export default ReimbursementContractsSearch;
