import React from "react";
import isEmpty from "lodash/isEmpty";
import { Query } from "react-apollo";
import { loader } from "graphql.macro";
import { Box, Flex } from "@rebass/emotion";
import { Trans, DateFormat } from "@lingui/macro";

import { Form, Validation, LocationParams } from "@ehealth/components";
import {
  getFullName,
  parseSortingParams,
  stringifySortingParams
} from "@ehealth/utils";
import { AdminSearchIcon, RemoveItemIcon } from "@ehealth/icons";

import ContractRequestsNav from "../ContractRequestsNav";

import Table from "../../../components/Table";
import Badge from "../../../components/Badge";
import LoadingOverlay from "../../../components/LoadingOverlay";
import Link from "../../../components/Link";
import Pagination from "../../../components/Pagination";
import * as Field from "../../../components/Field";
import AssigneeSearch from "../../../components/AssigneeSearch";
import Button, { IconButton } from "../../../components/Button";

import { SEARCH_REQUEST_PATTERN } from "../../../constants/contractRequests";
import { ITEMS_PER_PAGE } from "../../../constants/pagination";
import STATUSES from "../../../helpers/statuses";
import contractFormFilteredParams from "../../../helpers/contractFormFilteredParams";

const SearchCapitationContractRequestsQuery = loader(
  "../../../graphql/SearchCapitationContractRequestsQuery.graphql"
);

const contractStatuses = Object.entries(STATUSES.CONTRACT_REQUEST).map(
  ([key, value]) => ({ key, value })
);

const CapitationContractRequestsSearch = () => (
  <Box p={6}>
    <ContractRequestsNav />
    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { filter, first, last, after, before, orderBy } = locationParams;

        return (
          <>
            <SearchContractRequestsForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
            />
            <Query
              query={SearchCapitationContractRequestsQuery}
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
                  capitationContractRequests: {
                    nodes: capitationContractRequests = [],
                    pageInfo
                  } = {}
                } = {},
                refetch
              }) => {
                if (error) return `Error! ${error.message}`;
                return (
                  <LoadingOverlay loading={loading}>
                    {capitationContractRequests.length > 0 && (
                      <>
                        <Table
                          data={capitationContractRequests}
                          header={{
                            databaseId: (
                              <Trans>Contract request databaseID</Trans>
                            ),
                            contractNumber: <Trans>Contract Number</Trans>,
                            edrpou: <Trans>EDRPOU</Trans>,
                            contractorLegalEntityName: (
                              <Trans>Name of medical institution</Trans>
                            ),
                            assigneeName: <Trans>Performer</Trans>,
                            status: <Trans>Status</Trans>,
                            startDate: (
                              <Trans>The contract is valid with</Trans>
                            ),
                            endDate: <Trans>The contract is valid for</Trans>,
                            insertedAt: <Trans>Added</Trans>,
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
                            ...capitationContractRequests
                          }) => ({
                            ...capitationContractRequests,
                            edrpou,
                            contractorLegalEntityName,
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
                          tableName="capitationContractRequests/search"
                          whiteSpaceNoWrap={["databaseId"]}
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

const SearchContractRequestsForm = ({ initialValues, onSubmit }) => (
  <Form
    initialValues={initialValues}
    onSubmit={params =>
      onSubmit({
        ...params,
        after: undefined,
        before: undefined,
        last: undefined,
        first: initialValues.first || ITEMS_PER_PAGE[0]
      })
    }
  >
    <Flex mx={-1}>
      <Box px={1} width={1 / 2}>
        <Trans
          id="EDRPOU or Contract number"
          render={({ translation }) => (
            <Field.Text
              name="filter.searchRequest"
              label={<Trans>Search contract request</Trans>}
              placeholder={translation}
              postfix={<AdminSearchIcon color="#CED0DA" />}
            />
          )}
        />
        <Validation.Matches
          field="filter.searchRequest"
          options={SEARCH_REQUEST_PATTERN}
          message={<Trans>Invalid number</Trans>}
        />
      </Box>

      <Box px={1} width={2 / 5}>
        <AssigneeSearch />
      </Box>
    </Flex>
    <Flex mx={-1}>
      <Box px={1} width={1 / 6}>
        <Trans
          id="All statuses"
          render={({ translation }) => (
            <Field.Select
              name="filter.status"
              label={<Trans>Contract Request status</Trans>}
              placeholder={translation}
              items={[{ value: translation }, ...contractStatuses]}
              renderItem={item => item.value}
              itemToString={item => {
                if (!item) return translation;
                return typeof item === "string" ? item : item.value;
              }}
              variant="select"
            />
          )}
        />
      </Box>

      <Flex px={1}>
        <Box mr={1}>
          <Field.RangePicker
            rangeNames={["filter.date.startFrom", "filter.date.startTo"]}
            label={<Trans>Contract start date</Trans>}
          />
        </Box>

        <Field.RangePicker
          rangeNames={["filter.date.endFrom", "filter.date.endTo"]}
          label={<Trans>Contract end date</Trans>}
        />
      </Flex>
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

export default CapitationContractRequestsSearch;
