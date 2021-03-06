import React from "react";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { Flex, Box, Heading, Text } from "@rebass/emotion";
import { BooleanValue } from "react-values";
import { loader } from "graphql.macro";
import { Trans, t, DateFormat } from "@lingui/macro";
import { I18n } from "@lingui/react";
import isEmpty from "lodash/isEmpty";
import { Form, Validation, Modal, LocationParams } from "@ehealth/components";
import { SearchIcon } from "@ehealth/icons";
import {
  parseSortingParams,
  stringifySortingParams,
  getFullName
} from "@ehealth/utils";

import Tabs from "../../components/Tabs";
import Link from "../../components/Link";
import Line from "../../components/Line";
import LoadingOverlay from "../../components/LoadingOverlay";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import EmptyData from "../../components/EmptyData";
import Breadcrumbs from "../../components/Breadcrumbs";
import AddressView from "../../components/AddressView";
import DocumentView from "../../components/DocumentView";
import DictionaryValue from "../../components/DictionaryValue";
import DefinitionListView from "../../components/DefinitionListView";

import {
  DECLARATION_SEARCH_PATTERN,
  DECLARATION_ID_PATTERN
} from "../../constants/declarationSearchPatterns";
import Pagination from "../../components/Pagination";
import { ITEMS_PER_PAGE } from "../../constants/pagination";

const ResetAuthMethodMutation = loader(
  "../../graphql/ResetAuthMethodMutation.graphql"
);
const PersonQuery = loader("../../graphql/PersonQuery.graphql");
const PersonDeclarationsQuery = loader(
  "../../graphql/PersonDeclarationsQuery.graphql"
);

const Details = ({ id }) => (
  <Query query={PersonQuery} fetchPolicy="network-only" variables={{ id }}>
    {({ loading, error, data: { person = {} } = {} }) => {
      if (isEmpty(person)) return null;
      const {
        databaseId,
        status,
        firstName,
        secondName,
        lastName,
        gender,
        birthDate,
        birthCountry,
        birthSettlement,
        addresses,
        taxId,
        unzr,
        email,
        phones = [],
        preferredWayCommunication,
        documents,
        authenticationMethods,
        emergencyContact,
        confidantPersons
      } = person;
      const authInfo =
        !isEmpty(authenticationMethods) && authenticationMethods[0];

      const userInfo = {
        firstName,
        secondName,
        lastName,
        birthDate,
        birthCountry,
        birthSettlement,
        gender,
        addresses,
        taxId,
        unzr,
        documents,
        email,
        preferredWayCommunication,
        phones
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
            <Tabs.NavItem to="./emergency-contact">
              <Trans>Emergency Contact</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./confidant-persons">
              <Trans>Confidant Persons</Trans>
            </Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Router>
              <UserInfo path="/" data={userInfo} />
              <AuthInfo
                path="auth"
                databaseId={databaseId}
                authInfo={authInfo}
                status={status}
              />
              <DeclarationsInfo path="declarations" />
              <EmergencyContact
                data={emergencyContact}
                path="emergency-contact"
              />
              <ConfidantPersons
                data={confidantPersons}
                path="confidant-persons"
              />
            </Router>
          </Tabs.Content>
        </LoadingOverlay>
      );
    }}
  </Query>
);

const UserInfo = ({
  data: {
    firstName,
    secondName,
    lastName,
    gender,
    birthDate,
    phones,
    documents = [],
    relationshipDocuments = [],
    addresses = [],
    relationType,
    ...person
  }
}) => {
  const [mobilePhone] = getDataByType("MOBILE", phones);
  const [landLinePhone] = getDataByType("LAND_LINE", phones);

  return (
    <Box p={5}>
      <DefinitionListView
        labels={{
          fullName: relationType ? (
            <Trans>PIB</Trans>
          ) : (
            <Trans>Patient Name</Trans>
          ),
          gender: <Trans>Gender</Trans>,
          birthDate: <Trans>Date of birth</Trans>,
          birthCountry: <Trans>Country of birth</Trans>,
          birthSettlement: <Trans>Place of birth</Trans>,
          registrationAddress: <Trans>Registration address</Trans>,
          residenceAddress: <Trans>Residence address</Trans>,
          taxId: <Trans>INN</Trans>,
          unzr: <Trans>Record ID in EDDR</Trans>,
          preferredWayCommunication: (
            <Trans>Preferred way of communication</Trans>
          ),
          email: <Trans>Email</Trans>,
          mobilePhone: <Trans>Mobile number</Trans>,
          landLinePhone: <Trans>Stationary number</Trans>
        }}
        data={{
          ...person,
          gender: <DictionaryValue name="GENDER" item={gender} />,
          birthDate: <DateFormat value={birthDate} />,
          fullName: getFullName({ firstName, secondName, lastName }),
          registrationAddress: getAddressByType(addresses, "REGISTRATION"),
          residenceAddress: getAddressByType(addresses, "RESIDENCE"),
          mobilePhone: mobilePhone && mobilePhone.number,
          landLinePhone: landLinePhone && landLinePhone.number
        }}
      />
      {!isEmpty(documents) && (
        <Box py={4}>
          <Heading fontSize="1" fontWeight="normal">
            <Trans>Documents</Trans>
          </Heading>
          <Documents documents={documents} dictionary="DOCUMENT_TYPE" />
        </Box>
      )}
      {!isEmpty(relationshipDocuments) && (
        <Box pt={4}>
          <Heading fontSize="1" fontWeight="normal">
            <Trans>Documents confirming the credentials of the confidant</Trans>
          </Heading>
          <Documents
            documents={relationshipDocuments}
            dictionary="DOCUMENT_RELATIONSHIP_TYPE"
          />
        </Box>
      )}
    </Box>
  );
};

const AuthInfo = ({ id, databaseId, authInfo, status }) =>
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
            {resetPersonAuth => (
              <BooleanValue>
                {({ value: opened, toggle }) => (
                  <>
                    <Button
                      variant="green"
                      disabled={opened || status === "INACTIVE"}
                      onClick={toggle}
                    >
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
                                try {
                                  await resetPersonAuth({
                                    variables: {
                                      input: { personId: databaseId }
                                    }
                                  });
                                } catch (errors) {
                                  return errors;
                                }
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
      const {
        first,
        last,
        after,
        before,
        orderBy,
        filter: { declarationSearch } = {}
      } = locationParams;

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
            query={PersonDeclarationsQuery}
            variables={{
              id,
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
              filter: { ...declarationRequest }
            }}
          >
            {({ loading, error, data }) => {
              if (error || isEmpty(data)) return null;
              const {
                declarations: { nodes: declarations = [], pageInfo } = {}
              } = data.person;
              return (
                <LoadingOverlay loading={loading}>
                  {declarations.length > 0 && (
                    <>
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
                          id: declarationId,
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
                            name,
                            edrpou,
                            divisionName,
                            startDate: <DateFormat value={startDate} />,
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
                              <Link
                                to={`/declarations/${declarationId}`}
                                fontWeight="bold"
                              >
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
              postfix={<SearchIcon color="silverCity" />}
            />
          )}
        </I18n>
        <Validation.Matches
          field="filter.declarationSearch"
          options={DECLARATION_SEARCH_PATTERN}
          message="Invalid number"
        />
      </Box>
    </Flex>
    <input type="submit" hidden />
  </Form>
);

const EmergencyContact = ({ data }) => {
  if (!data) return null;

  const { firstName, secondName, lastName, phones } = data;
  const [mobilePhone] = getDataByType("MOBILE", phones);
  const [landLinePhone] = getDataByType("LAND_LINE", phones);

  return (
    <Box p={5}>
      <DefinitionListView
        labels={{
          fullName: <Trans>PIB</Trans>,
          mobilePhone: <Trans>Mobile number</Trans>,
          landLinePhone: <Trans>Stationary number</Trans>
        }}
        data={{
          fullName: getFullName({ firstName, secondName, lastName }),
          mobilePhone: mobilePhone && mobilePhone.number,
          landLinePhone: landLinePhone && landLinePhone.number
        }}
      />
    </Box>
  );
};

const ConfidantPersons = ({ data }) => {
  if (!data) return <EmptyData />;

  const [primaryPerson] = getDataByType("PRIMARY", data, "relationType");
  const [secondaryPerson] = getDataByType("SECONDARY", data, "relationType");

  return (
    <>
      {primaryPerson && (
        <>
          <Heading fontSize="1" fontWeight="normal" p={5} pb={0}>
            <Trans>Primary Confidant Persons</Trans>
          </Heading>
          <UserInfo data={primaryPerson} />
        </>
      )}

      {secondaryPerson && (
        <>
          <Line />
          <Heading fontSize="1" fontWeight="normal" p={5} py={2}>
            <Trans>Secondary Confidant Persons</Trans>
          </Heading>
          <UserInfo data={secondaryPerson} />
        </>
      )}
    </>
  );
};

const Documents = ({ documents, dictionary }) => {
  if (isEmpty(documents)) return null;
  return documents.map(({ type, ...documentDetails }, index) => (
    <Box key={index}>
      <Heading fontSize="0" fontWeight="bold" py={4}>
        <DictionaryValue name={dictionary} item={type} />
      </Heading>
      <DocumentView data={documentDetails} />
    </Box>
  ));
};

const getDataByType = (type, arr, key = "type") =>
  arr.filter(t => t[key] === type);

const getAddressByType = (addresses, type) => {
  if (isEmpty(addresses)) return null;

  const address = addresses.find(a => a.type === type);
  return <AddressView data={address} />;
};

export default Details;
