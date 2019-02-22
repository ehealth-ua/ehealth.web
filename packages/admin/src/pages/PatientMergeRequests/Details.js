import React from "react";
import { isEqual, isEmpty } from "lodash";
import Composer from "react-composer";
import { Flex, Box, Text, Heading as Title } from "@rebass/emotion";
import { Query, Mutation } from "react-apollo";
import { BooleanValue } from "react-values";
import { loader } from "graphql.macro";
import { Trans, DateFormat } from "@lingui/macro";
import { getPhones } from "@ehealth/utils";
import system from "@ehealth/system-components";
import { Form, Modal } from "@ehealth/components";

import Link from "../../components/Link";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import Breadcrumbs from "../../components/Breadcrumbs";
import LoadingOverlay from "../../components/LoadingOverlay";
import AuthMethodsList from "../../components/AuthMethodsList";
import DictionaryValue from "../../components/DictionaryValue";
import DefinitionListView from "../../components/DefinitionListView";

import AddressView from "../../components/AddressView";

import {
  TableRoot,
  TableBodyComponent,
  TableCell,
  TableRow
} from "../../components/Table";
import handleMutation from "../../helpers/handleMutation";

const MergeRequestQuery = loader("../../graphql/MergeRequestQuery.graphql");
const UpdateMergeRequestMutation = loader(
  "../../graphql/UpdateMergeRequestMutation.graphql"
);

const Details = ({ id, navigate }) => (
  <Query query={MergeRequestQuery} variables={{ id }}>
    {({ loading, error, data }) => {
      if (error) return null;
      const {
        mergeRequest: {
          status,
          manualMergeCandidate: {
            mergeCandidate: {
              databaseId: databaseMergeCandidateId,
              person,
              masterPerson
            } = {}
          } = {}
        } = {}
      } = data || {};

      return (
        <LoadingOverlay loading={loading}>
          <Box p={6}>
            <Box px={3} py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/patient-merge-requests">
                  <Trans>Patients Merge</Trans>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Trans>Request details</Trans>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Flex justifyContent="space-between" alignItems="flex-end">
              <Box px={3}>
                <DefinitionListView
                  labels={{
                    status: <Trans>Request status</Trans>,
                    pairId: <Trans>Pair ID</Trans>
                  }}
                  data={{
                    pairId: databaseMergeCandidateId,
                    status: (
                      <Badge
                        name={status}
                        type="PATIENT_MERGE_REQUEST"
                        minWidth={100}
                      />
                    )
                  }}
                  color="#7F8FA4"
                  labelWidth="120px"
                />
              </Box>
            </Flex>

            {person &&
              masterPerson && (
                <>
                  <Heading>
                    <Trans>General information</Trans>
                  </Heading>
                  <Table
                    header={{
                      firstName: <Trans>First name</Trans>,
                      lastName: <Trans>Last name</Trans>,
                      secondName: <Trans>Second name</Trans>,
                      birthDate: <Trans>Date of birth</Trans>,
                      birthCountry: <Trans>Country of birth</Trans>,
                      birthSettlement: <Trans>Settlement of birth</Trans>,
                      gender: <Trans>Gender</Trans>,
                      email: <Trans>Email</Trans>,
                      preferredWayCommunication: (
                        <Trans>Preferred way of communication</Trans>
                      )
                    }}
                    data={[person, masterPerson]}
                    renderRow={({ birthDate, gender, ...content }) => ({
                      ...content,
                      gender: <DictionaryValue name="GENDER" item={gender} />,
                      birthDate: <DateFormat value={birthDate} />
                    })}
                  />

                  <Heading>
                    <Trans>Identity Information</Trans>
                  </Heading>
                  <Table
                    header={{
                      unzr: <Trans>Record ID in EDDR</Trans>,
                      taxId: <Trans>INN</Trans>,
                      noTaxId: <Trans>No tax ID</Trans>
                    }}
                    data={[person, masterPerson]}
                    renderRow={({ noTaxId, ...content }) => ({
                      ...content,
                      noTaxId: noTaxId ? <Trans>Yes</Trans> : <Trans>No</Trans>
                    })}
                  />

                  <Heading>
                    <Trans>Phones</Trans>
                  </Heading>
                  <Table
                    header={{
                      authenticationMethods: (
                        <Trans>Authentication method</Trans>
                      ),
                      phones: <Trans>Phones</Trans>
                    }}
                    data={[person, masterPerson]}
                    renderRow={({ authenticationMethods, phones = [] }) => ({
                      authenticationMethods: (
                        <AuthMethodsList data={authenticationMethods} />
                      ),
                      phones: phones.length > 0 && getPhones(phones)
                    })}
                  />

                  <Heading>
                    <Trans>Documents</Trans>
                  </Heading>
                  <DictionaryValue name="DOCUMENT_TYPE">
                    {documentsHeader => (
                      <DocumentsTable
                        header={documentsHeader}
                        person={person.documents}
                        masterPerson={masterPerson.documents}
                      />
                    )}
                  </DictionaryValue>

                  <Heading>
                    <Trans>Address</Trans>
                  </Heading>
                  <DictionaryValue name="ADDRESS_TYPE">
                    {addressesHeader => (
                      <Table
                        header={addressesHeader}
                        data={combineNestedData(
                          person.addresses,
                          masterPerson.addresses,
                          addressesHeader
                        )}
                        renderRow={({ RESIDENCE, REGISTRATION }) => ({
                          RESIDENCE: <AddressView data={RESIDENCE} />,
                          REGISTRATION: <AddressView data={REGISTRATION} />
                        })}
                      />
                    )}
                  </DictionaryValue>

                  <Heading>
                    <Trans>Emergency Contact</Trans>
                  </Heading>
                  <Table
                    header={{
                      firstName: <Trans>First name</Trans>,
                      lastName: <Trans>Last name</Trans>,
                      secondName: <Trans>Second name</Trans>,
                      phones: <Trans>Phones</Trans>
                    }}
                    data={[
                      person.emergencyContact,
                      masterPerson.emergencyContact
                    ]}
                    renderRow={({ phones = [], ...name }) => ({
                      ...name,
                      phones: phones.length > 0 && getPhones(phones)
                    })}
                  />

                  <ConfidantPersons
                    person={person.confidantPersons}
                    masterPerson={masterPerson.confidantPersons}
                  />

                  <Heading>
                    <Trans>Other</Trans>
                  </Heading>
                  <Table
                    header={{
                      id: <Trans>Declarations</Trans>
                    }}
                    data={[person, masterPerson]}
                    renderRow={({ id }) => ({
                      id: (
                        <Link
                          to={`../../persons/${id}/declarations`}
                          fontWeight="bold"
                        >
                          <Trans>Show declarations</Trans>
                        </Link>
                      )
                    })}
                    skipComparison
                  />

                  <Flex my={5} justifyContent="space-between">
                    <Flex>
                      <Box mr={4}>
                        <Popup
                          variant="light"
                          buttonText={<Trans>Trash</Trans>}
                          title={<Trans>Trash Merge Request</Trans>}
                          status="TRASH"
                          id={id}
                          navigate={navigate}
                        />
                      </Box>

                      <Popup
                        variant="blue"
                        buttonText={<Trans>Postpone</Trans>}
                        title={<Trans>Postpone Merge Request</Trans>}
                        status="POSTPONE"
                        id={id}
                        navigate={navigate}
                        disabled={status === "POSTPONE"}
                      />
                    </Flex>

                    <Flex>
                      <Box mr={4}>
                        <Popup
                          variant="red"
                          buttonText={<Trans>Split</Trans>}
                          title={<Trans>Split Merge Request</Trans>}
                          status="SPLIT"
                          id={id}
                          navigate={navigate}
                        />
                      </Box>
                      <Popup
                        variant="green"
                        buttonText={<Trans>Merge</Trans>}
                        title={<Trans>Merge Merge Request</Trans>}
                        status="MERGE"
                        id={id}
                        navigate={navigate}
                      />
                    </Flex>
                  </Flex>
                </>
              )}
          </Box>
        </LoadingOverlay>
      );
    }}
  </Query>
);

const ConfidantPersons = ({ person, masterPerson }) => {
  const getRelationTypes = person => ({
    primary:
      !isEmpty(person) && person.find(item => item.relationType === "PRIMARY"),
    secondary:
      !isEmpty(person) && person.find(item => item.relationType === "SECONDARY")
  });

  const master = getRelationTypes(masterPerson);
  const slave = getRelationTypes(person);

  return (
    <>
      {(master.primary || slave.primary) && (
        <>
          <Heading>
            <Trans>Primary Confidant Persons</Trans>
          </Heading>
          <ConfidantPersonsPair
            person={slave.primary}
            masterPerson={master.primary}
            relationType="PRIMARY"
          />
        </>
      )}

      {(master.secondary || slave.secondary) && (
        <>
          <Heading>
            <Trans>Secondary Confidant Persons</Trans>
          </Heading>
          <ConfidantPersonsPair
            person={slave.secondary}
            masterPerson={master.secondary}
            relationType="SECONDARY"
          />
        </>
      )}
    </>
  );
};

const ConfidantPersonsPair = ({
  person = {},
  masterPerson = {},
  relationType
}) => (
  <>
    <Table
      header={{
        relationType: <Trans>Relation type</Trans>,
        firstName: <Trans>First name</Trans>,
        lastName: <Trans>Last name</Trans>,
        secondName: <Trans>Second name</Trans>,
        birthDate: <Trans>Date of birth</Trans>,
        birthCountry: <Trans>Country of birth</Trans>,
        birthSettlement: <Trans>Settlement of birth</Trans>,
        gender: <Trans>Gender</Trans>,
        email: <Trans>Email</Trans>,
        unzr: <Trans>Record ID in EDDR</Trans>,
        taxId: <Trans>INN</Trans>,
        phones: <Trans>Phones</Trans>,
        preferredWayCommunication: <Trans>Preferred way of communication</Trans>
      }}
      data={[person, masterPerson]}
      renderRow={({
        relationType,
        phones = [],
        birthDate,
        gender,
        ...person
      }) => {
        return {
          ...person,
          relationType: (
            <DictionaryValue name="CONFIDANT_PERSON_TYPE" item={relationType} />
          ),
          birthDate: <DateFormat value={birthDate} />,
          gender: <DictionaryValue name="GENDER" item={gender} />,
          phones: phones.length > 0 && getPhones(phones)
        };
      }}
    />
    <Composer
      components={[
        <DictionaryValue name="DOCUMENT_TYPE" />,
        <DictionaryValue name="DOCUMENT_RELATIONSHIP_TYPE" />
      ]}
    >
      {([documentsHeader, documentsRelationshipHeader]) => (
        <>
          <DocumentsTable
            header={documentsHeader}
            person={person.documents}
            masterPerson={masterPerson.documents}
          />
          <DocumentsTable
            header={documentsRelationshipHeader}
            person={person.relationshipDocuments}
            masterPerson={masterPerson.relationshipDocuments}
          />
        </>
      )}
    </Composer>
  </>
);

const DocumentsTable = ({ header, person, masterPerson, ...props }) => (
  <Table
    header={header}
    data={combineNestedData(person, masterPerson, header)}
    renderRow={({ ...documents }, mismatch) => {
      const [row] = Object.entries(documents).map(([key, value], index) => ({
        [key]: <Document data={value} mismatch={mismatch} />
      }));
      return row;
    }}
    {...props}
    hideEmptyFields
  />
);

const Document = ({ data, mismatch }) =>
  data ? (
    <Box pb={2}>
      <DefinitionListView
        labels={{
          number: <Trans>Number</Trans>,
          issuedAt: <Trans>Issued at</Trans>,
          issuedBy: <Trans>Issued by</Trans>
        }}
        data={{
          ...data,
          issuedAt: <DateFormat value={data.issuedAt} />
        }}
        labelWidth="100px"
        marginBottom={0}
        color={mismatch && "redPigment"}
      />
    </Box>
  ) : null;

const Table = ({
  renderRow,
  header,
  data,
  skipComparison,
  hideEmptyFields
}) => {
  const transformedData = (
    header,
    [firstValue, secondValue],
    hideEmptyFields
  ) => {
    const person = !isEmpty(firstValue) ? firstValue : {};
    const masterPerson = !isEmpty(secondValue) ? secondValue : {};

    const result = Object.entries(header).reduce(
      (summary, [key, translation]) => {
        const data = { [key]: [translation, person[key], masterPerson[key]] };
        if (hideEmptyFields) {
          if (person[key] || masterPerson[key]) {
            return [...summary, data];
          } else return summary;
        } else return [...summary, data];
      },
      []
    );
    return result;
  };

  return (
    <TableRoot fontSize={1}>
      <TableBodyComponent>
        {transformedData(header, data, hideEmptyFields).map((item, index) => (
          <TableRow key={`row-${index}`}>
            {Object.entries(item).map(([key, values]) =>
              values.map((value, index) => {
                const mismatch =
                  !skipComparison && !isEqual(values[1], values[2]);
                const row = renderRow({ [key]: value }, mismatch);
                return (
                  <TableCell
                    key={`${key}-${index}`}
                    mismatch={mismatch}
                    variant="horizontal"
                  >
                    {index ? row[key] : value}
                  </TableCell>
                );
              })
            )}
          </TableRow>
        ))}
      </TableBodyComponent>
    </TableRoot>
  );
};

const Popup = ({
  id,
  variant,
  buttonText,
  title,
  status,
  disabled,
  navigate
}) => {
  return (
    <BooleanValue>
      {({ value: opened, toggle }) => (
        <>
          <Button
            width={120}
            variant={variant}
            disabled={disabled}
            onClick={toggle}
          >
            {buttonText}
          </Button>
          {opened && (
            <Modal width={760} backdrop>
              <Title as="h1" fontWeight="normal" mb={6}>
                {title}
              </Title>
              <Mutation
                mutation={UpdateMergeRequestMutation}
                refetchQueries={() => [
                  {
                    query: MergeRequestQuery,
                    variables: {
                      id
                    }
                  }
                ]}
              >
                {updateMergeRequest => (
                  <Form
                    onSubmit={({ comment }) =>
                      handleMutation(
                        () =>
                          updateMergeRequest({
                            variables: { input: { id, status, comment } }
                          }),
                        () => navigate("/patient-merge-requests/search")
                      )
                    }
                  >
                    <Trans
                      id="Enter comment"
                      render={({ translation }) => (
                        <Field.Textarea
                          name="comment"
                          placeholder={translation}
                          rows={5}
                          maxlength="3000"
                          showLengthHint
                        />
                      )}
                    />
                    <Flex justifyContent="left">
                      <Box mr={20}>
                        <Button type="reset" variant="light" onClick={toggle}>
                          <Trans>Return</Trans>
                        </Button>
                      </Box>
                      <Button type="submit" width={120} variant="blue">
                        {buttonText}
                      </Button>
                    </Flex>
                  </Form>
                )}
              </Mutation>
            </Modal>
          )}
        </>
      )}
    </BooleanValue>
  );
};

const convertTypeToKey = (data = [], types) =>
  types.reduce(
    (summary, item) => ({
      ...summary,
      [item]: data.find(({ type }) => type === item)
    }),
    {}
  );

const combineNestedData = (person, masterPerson, header) => {
  const types = Object.keys(header);
  return [
    convertTypeToKey(person, types),
    convertTypeToKey(masterPerson, types)
  ];
};

const Heading = system(
  {
    is: Text,
    fontSize: 1,
    fontWeight: "bold",
    m: 3,
    mt: 5
  },
  "fontSize",
  "fontWeight",
  "space"
);

export default Details;
