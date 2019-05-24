import React from "react";
import { Box, Heading } from "@rebass/emotion";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import createDecorator from "final-form-calculate";
import isEmpty from "lodash/isEmpty";
import { Trans } from "@lingui/macro";
import { LocationParams } from "@ehealth/components";
import { convertStringToBoolean } from "@ehealth/utils";
import Pagination from "../../../components/Pagination";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { ITEMS_PER_PAGE } from "../../../constants/pagination";
import SearchForm from "../../../components/SearchForm";
import { PrimarySearchFields } from "./SearchFields";
import Table from "./Table";

const ID_PATTERN =
  "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";

const Search = () => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      <Trans>Search legal entities</Trans>
    </Heading>

    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const {
          filter: { code, addresses, nhsVerified, type, edrVerified } = {},
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
          edrVerified: convertStringToBoolean(edrVerified),
          addresses: isEmpty(addresses)
            ? undefined
            : {
                settlementId: addresses.id,
                type: addresses.settlementType
              },
          type: type ? [type] : undefined
        };
        return (
          <>
            <SearchForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
              renderPrimary={PrimarySearchFields}
              decorators={[resetValue]}
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
                } = {}
              }) => {
                if (isEmpty(legalEntities)) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    <Table
                      locationParams={locationParams}
                      setLocationParams={setLocationParams}
                      legalEntities={legalEntities}
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

const SearchLegalEntitiesQuery = gql`
  query SearchLegalEntitiesQuery(
    $filter: LegalEntityFilter
    $orderBy: LegalEntityOrderBy
    $before: String
    $after: String
    $first: Int
    $last: Int
    $skip: Boolean = false
  ) {
    legalEntities(
      first: $first
      filter: $filter
      orderBy: $orderBy
      before: $before
      after: $after
      last: $last
    ) @skip(if: $skip) {
      nodes {
        ...LegalEntity
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
  ${Table.fragments.entry}
  ${Pagination.fragments.entry}
`;

const resetValue = createDecorator(
  {
    field: "filter.code",
    updates: {
      "filter.addresses": (value, { filter = {} }) => {
        return value ? undefined : filter.addresses;
      },
      "filter.nhsVerified": (value, { filter = {} }) => {
        return value ? undefined : filter.nhsVerified;
      }
    }
  },
  {
    field: "filter.addresses",
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
