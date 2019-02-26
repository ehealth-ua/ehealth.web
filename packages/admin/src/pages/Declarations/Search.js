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
import {
  SearchIcon,
  RemoveItemIcon,
  PositiveIcon,
  NegativeIcon
} from "@ehealth/icons";

import Link from "../../components/Link";
import Badge from "../../components/Badge";
import LoadingOverlay from "../../components/LoadingOverlay";
import Table from "../../components/Table";
import * as Field from "../../components/Field";
import Button, { IconButton } from "../../components/Button";
import AddressView from "../../components/AddressView";
import { DECLARATION_NUMBER_PATTERN } from "../../constants/declarationSearchPatterns";

const DeclarationByNumberQuery = loader(
  "../../graphql/DeclarationByNumberQuery.graphql"
);

const Search = () => (
  <Box p={6}>
    <Heading as="h1" fontWeight="normal" mb={6}>
      <Trans>Search for Declarations</Trans>
    </Heading>

    <LocationParams>
      {({ locationParams, setLocationParams }) => {
        const { filter: { declarationNumber } = {} } = locationParams;

        return (
          <>
            <SearchDeclarationForm
              initialValues={locationParams}
              onSubmit={setLocationParams}
            />
            <Query
              skip={isEmpty(declarationNumber)}
              query={DeclarationByNumberQuery}
              variables={{ declarationNumber }}
            >
              {({
                loading,
                error,
                data: { declarationByNumber = {} } = {}
              }) => {
                if (isEmpty(declarationByNumber)) return null;
                return (
                  <LoadingOverlay loading={loading}>
                    <Table
                      data={[declarationByNumber]}
                      header={{
                        databaseId: <Trans>Declaration ID</Trans>,
                        declarationNumber: <Trans>Declaration number</Trans>,
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
                            {person.noTaxId ? (
                              <PositiveIcon />
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
                      sortingParams={parseSortingParams(locationParams.orderBy)}
                      onSortingChange={sortingParams =>
                        setLocationParams({
                          orderBy: stringifySortingParams(sortingParams)
                        })
                      }
                      tableName="declaration-by-number/search"
                      whiteSpaceNoWrap={["databaseId"]}
                      hiddenFields="noTaxId,patientName,databaseId"
                    />
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
        ...params
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
              postfix={<SearchIcon color="silverCity" />}
              autoComplete="off"
            />
          )}
        />
        <Validation.Matches
          field="filter.declarationNumber"
          options={DECLARATION_NUMBER_PATTERN}
          message="Invalid number"
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
