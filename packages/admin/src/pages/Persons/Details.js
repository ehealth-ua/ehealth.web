import React from "react";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { Flex, Box, Heading, Text } from "rebass/emotion";
import { BooleanValue } from "react-values";
import { loader } from "graphql.macro";
import { Trans, t, DateFormat } from "@lingui/macro";
import { I18n } from "@lingui/react";
import isEmpty from "lodash/isEmpty";
import { Form, Validation, Modal, LocationParams } from "@ehealth/components";
import { AdminSearchIcon } from "@ehealth/icons";
import {
  parseSortingParams,
  stringifySortingParams,
  getFullName
} from "@ehealth/utils";

import Tabs from "../../components/Tabs";
import Link from "../../components/Link";
import LoadingOverlay from "../../components/LoadingOverlay";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import Breadcrumbs from "../../components/Breadcrumbs";
import AddressView from "../../components/AddressView";
import DefinitionListView from "../../components/DefinitionListView";

import {
  DECLARATION_SEARCH_PATTERN,
  DECLARATION_ID_PATTERN
} from "../../constants/declarationSearchPatterns";

const ResetAuthMethodMutation = loader(
  "../../graphql/ResetAuthMethodMutation.graphql"
);
const PersonQuery = loader("../../graphql/PersonQuery.graphql");

const filterData = (type, arr) => arr.filter(t => t.type === type);

const Details = ({ id }) => (
  <Query query={PersonQuery} fetchPolicy="network-only" variables={{ id }}>
    {({ loading, error, data: { person = {} } = {} }) => {
      if (error) return `Error! ${error.message}`;
      const {
        id,
        databaseId,
        status,
        firstName,
        secondName,
        lastName,
        birthDate,
        birthCountry,
        birthSettlement,
        taxId,
        unzr,
        phones = [],
        authenticationMethods
      } = person;

      const [mobilePhone] = filterData("MOBILE", phones);
      const [landLinePhone] = filterData("LAND_LINE", phones);
      const authInfo = authenticationMethods[0];

      const userInfo = {
        firstName,
        secondName,
        lastName,
        birthDate,
        birthCountry,
        birthSettlement,
        taxId,
        unzr,
        mobilePhone: mobilePhone && mobilePhone.number,
        landLinePhone: landLinePhone && landLinePhone.number
      };

      return (
        <LoadingOverlay loading={loading}>
          <Box p={6}>
            <Box mb={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/persons">
                  <Trans>Patient Search</Trans>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Trans>Details of the patient</Trans>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <DefinitionListView
              labels={{
                databaseId: <Trans>Patient ID</Trans>,
                status: <Trans>Status</Trans>
              }}
              data={{
                databaseId,
                status: <Badge name={status} type="PERSON" minWidth={100} />
              }}
              color="#7F8FA4"
              labelWidth="100px"
            />
          </Box>
          <Tabs.Nav>
            <Tabs.NavItem to="./">
              <Trans>Personal information</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./auth">
              <Trans>Authentication method</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./declarations">
              <Trans>Declarations</Trans>
            </Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Router>
              <UserInfo path="/" userInfo={userInfo} />
              <AuthInfo path="auth" authInfo={authInfo} />
              <DeclarationsInfo path="declarations" />
            </Router>
          </Tabs.Content>
        </LoadingOverlay>
      );
    }}
  </Query>
);

const UserInfo = ({
  userInfo,
  birthDate,
  userInfo: { firstName, secondName, lastName }
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        fullName: <Trans>Patient Name</Trans>,
        birthDate: <Trans>Date of birth</Trans>,
        birthCountry: <Trans>Country of birth</Trans>,
        birthSettlement: <Trans>Place of birth</Trans>,
        taxId: <Trans>INN</Trans>,
        unzr: <Trans>Record ID in EDDR</Trans>,
        mobilePhone: <Trans>Mobile number</Trans>,
        landLinePhone: <Trans>Stationary number</Trans>
      }}
      data={{
        ...userInfo,
        birthDate: <DateFormat value={birthDate} />,
        fullName: getFullName({ firstName, secondName, lastName })
      }}
    />
  </Box>
);

const AuthInfo = ({ id, authInfo }) =>
  authInfo ? (
    <Box p={5}>
      <DefinitionListView
        labels={{
          type: <Trans>Authentication type</Trans>,
          phoneNumber: <Trans>Phone number</Trans>
        }}
        data={authInfo}
      />
      {authInfo.type !== "NA" && (
        <Box>
          <Mutation mutation={ResetAuthMethodMutation}>
            {resetPersonAuthenticationMethod => (
              <BooleanValue>
                {({ value: opened, toggle }) => (
                  <>
                    <Button variant="green" disabled={opened} onClick={toggle}>
                      <Trans>Reset Authentication Method</Trans>
                    </Button>
                    {opened && (
                      <Modal width={760} backdrop>
                        <Heading as="h1" fontWeight="normal" mb={6}>
                          <Trans>Change authentication method</Trans>
                        </Heading>
                        <Text lineHeight={2} textAlign="center" mb={6}>
                          <Trans>
                            Warning!
                            <br />
                            After confirmation, the authentication method will
                            be changed to the uncertain
                          </Trans>
                        </Text>
                        <Flex justifyContent="center">
                          <Box mx={2}>
                            <Button variant="blue" onClick={toggle}>
                              <Trans>Return</Trans>
                            </Button>
                          </Box>
                          <Box mx={2}>
                            <Button
                              variant="green"
                              onClick={async () => {
                                await resetPersonAuthenticationMethod({
                                  variables: { id }
                                });
                                toggle();
                              }}
                            >
                              <Trans>Reset Authentication Method</Trans>
                            </Button>
                          </Box>
                        </Flex>
                      </Modal>
                    )}
                  </>
                )}
              </BooleanValue>
            )}
          </Mutation>
        </Box>
      )}
    </Box>
  ) : null;

const DeclarationsInfo = ({ id }) => (
  <LocationParams>
    {({ locationParams, setLocationParams }) => {
      const { orderBy, filter: { declarationSearch } = {} } = locationParams;

      const isRequestById = new RegExp(DECLARATION_ID_PATTERN).test(
        declarationSearch
      );
      const declarationRequest =
        !isEmpty(declarationSearch) &&
        (isRequestById
          ? { declarationId: declarationSearch }
          : { declarationNumber: declarationSearch });

      return (
        <>
          <SearchDeclarationsForm
            initialValues={locationParams}
            onSubmit={setLocationParams}
          />
          <Query
            query={PersonQuery}
            variables={{
              id,
              orderBy,
              filter: { ...declarationRequest }
            }}
          >
            {({ loading, error, data }) => {
              if (error || isEmpty(data)) return null;
              const {
                person: { declarations = [] }
              } = data;
              return (
                <LoadingOverlay loading={loading}>
                  <Table
                    data={declarations}
                    header={{
                      databaseId: <Trans>Declaration ID</Trans>,
                      declarationNumber: <Trans>Declaration number</Trans>,
                      startDate: <Trans>Declaration valid from</Trans>,
                      name: <Trans>Legal entity</Trans>,
                      edrpou: <Trans>EDRPOU</Trans>,
                      divisionName: <Trans>Division name</Trans>,
                      address: <Trans>Address</Trans>,
                      status: <Trans>Status</Trans>,
                      action: <Trans>Action</Trans>
                    }}
                    renderRow={({
                      databaseId,
                      declarationNumber,
                      startDate,
                      legalEntity: { edrpou, name, addresses },
                      division: { name: divisionName },
                      status
                    }) => {
                      const [residenceAddress] = addresses.filter(
                        a => a.type === "RESIDENCE"
                      );
                      return {
                        databaseId,
                        declarationNumber,
                        startDate,
                        name,
                        edrpou,
                        divisionName,
                        address: residenceAddress && (
                          <AddressView data={residenceAddress} />
                        ),
                        status: (
                          <Badge
                            name={status}
                            type="DECLARATION"
                            display="block"
                          />
                        ),
                        action: (
                          <Link to={`/declarations/${id}`} fontWeight="bold">
                            <Trans>Show details</Trans>
                          </Link>
                        )
                      };
                    }}
                    sortableFields={["startDate", "status"]}
                    sortingParams={parseSortingParams(orderBy)}
                    onSortingChange={sortingParams =>
                      setLocationParams({
                        orderBy: stringifySortingParams(sortingParams)
                      })
                    }
                    whiteSpaceNoWrap={["databaseId"]}
                    hiddenFields="databaseId"
                    tableName="person-details/declarations"
                  />
                </LoadingOverlay>
              );
            }}
          </Query>
        </>
      );
    }}
  </LocationParams>
);

const SearchDeclarationsForm = ({ initialValues, onSubmit }) => (
  <Form onSubmit={onSubmit} initialValues={initialValues}>
    <Flex>
      <Box px={5} pt={5} width={460}>
        <I18n>
          {({ i18n }) => (
            <Field.Text
              name="filter.declarationSearch"
              label={<Trans>Declaration search</Trans>}
              placeholder={i18n._(t`Enter ID or Declaration number`)}
              postfix={<AdminSearchIcon color="#CED0DA" />}
            />
          )}
        </I18n>
        <Validation.Matches
          field="filter.declarationSearch"
          options={DECLARATION_SEARCH_PATTERN}
          message={<Trans>Invalid number</Trans>}
        />
      </Box>
    </Flex>
    <input type="submit" hidden />
  </Form>
);

export default Details;
