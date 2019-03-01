import React from "react";
import { Flex, Box } from "@rebass/emotion";
import { Query } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import { loader } from "graphql.macro";
import { DateFormat, Trans } from "@lingui/macro";
import { Validation, LocationParams } from "@ehealth/components";
import {
  getFullName,
  parseSortingParams,
  stringifySortingParams
} from "@ehealth/utils";
import { SearchIcon, NegativeIcon, RemoveItemIcon } from "@ehealth/icons";
import {
  SelectedItem,
  RemoveItem
} from "../../../components/Field/MultiSelectView";
import SearchModalForm from "../../../components/SearchModalForm";
import SearchForm from "../../../components/SearchForm";
import * as Field from "../../../components/Field";
import Link from "../../../components/Link";
import Table from "../../../components/Table";
import LoadingOverlay from "../../../components/LoadingOverlay";
import Pagination from "../../../components/Pagination";
import Badge from "../../../components/Badge";
import STATUSES from "../../../helpers/statuses";
import { SEARCH_CONTRACT_PATTERN } from "../../../constants/contracts";
import { ITEMS_PER_PAGE } from "../../../constants/pagination";
import contractFormFilteredParams from "../../../helpers/contractFormFilteredParams";
import ContractsNav from "../ContractsNav";

const SearchCapitationContractsQuery = loader(
  "../../../graphql/SearchCapitationContractsQuery.graphql"
);

const CapitationContractsSearch = ({ uri }) => (
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
              fields={PrimarySearchFields}
              selected={SelectedFilters}
              modal={SearchContractsModalForm}
            />
            <Query
              query={SearchCapitationContractsQuery}
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
                  capitationContracts: { nodes: contracts = [], pageInfo } = {}
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
                            contractNumber: <Trans>Contract Number</Trans>,
                            edrpou: <Trans>EDRPOU</Trans>,
                            name: <Trans>Name of medical institution</Trans>,
                            nhsSignerName: <Trans>Performer</Trans>,
                            startDate: (
                              <Trans>The contract is valid with</Trans>
                            ),
                            endDate: <Trans>The contract is valid for</Trans>,
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
                            assigneeName,
                            contractorLegalEntity: { edrpou, name },
                            insertedAt,
                            nhsSigner,
                            ...contracts
                          }) => ({
                            ...contracts,
                            edrpou,
                            name,
                            nhsSignerName: nhsSigner
                              ? getFullName(nhsSigner.party)
                              : undefined,
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
                            "contractorLegalEntityEdrpou",
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
                          tableName="contract/search"
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
          <Field.Text
            name="filter.contractorLegalEntity.name"
            label={<Trans>Legal entity name</Trans>}
            placeholder={translation}
          />
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

const SelectedFilters = ({ initialValues, onSubmit }) => {
  const { filter: { legalEntityRelation, isSuspended } = {} } = initialValues;

  return (
    <Flex>
      {legalEntityRelation && (
        <SelectedItem mx={1}>
          <Trans>
            contract of {STATUSES.LEGAL_ENTITY_RELATION[legalEntityRelation]}{" "}
            legal entity
          </Trans>
          <RemoveItem
            onClick={() => {
              onSubmit({
                ...initialValues,
                filter: {
                  ...initialValues.filter,
                  legalEntityRelation: undefined
                }
              });
            }}
          >
            <RemoveItemIcon />
          </RemoveItem>
        </SelectedItem>
      )}
      {isSuspended !== undefined && (
        <SelectedItem mx={1}>
          {STATUSES.SUSPENDED[isSuspended]}
          <RemoveItem
            onClick={() => {
              onSubmit({
                ...initialValues,
                filter: {
                  ...initialValues.filter,
                  isSuspended: undefined
                }
              });
            }}
          >
            <RemoveItemIcon />
          </RemoveItem>
        </SelectedItem>
      )}
    </Flex>
  );
};

const SearchContractsModalForm = ({
  fields: PrimarySearchFields,
  ...props
}) => (
  <SearchModalForm {...props}>
    <PrimarySearchFields />
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
    </Flex>
    <Flex mx={-1}>
      <Box width={1 / 3} px={1}>
        <Trans
          id="All contracts"
          render={({ translation }) => (
            <Field.Select
              name="filter.isSuspended"
              label={<Trans>Suspended</Trans>}
              placeholder={translation}
              items={Object.keys(STATUSES.SUSPENDED)}
              itemToString={item => STATUSES.SUSPENDED[item] || translation}
              variant="select"
              emptyOption
            />
          )}
        />
      </Box>
      <Box width={1 / 3} px={1}>
        <Trans
          id="All contracts"
          render={({ translation }) => (
            <Field.Select
              name="filter.legalEntityRelation"
              label={<Trans>Legal entity relation</Trans>}
              placeholder={translation}
              items={Object.keys(STATUSES.LEGAL_ENTITY_RELATION)}
              itemToString={item =>
                STATUSES.LEGAL_ENTITY_RELATION[item] || translation
              }
              variant="select"
              emptyOption
            />
          )}
        />
      </Box>
    </Flex>
  </SearchModalForm>
);

export default CapitationContractsSearch;
