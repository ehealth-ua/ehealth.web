import React from "react";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { Flex, Box, Heading, Text } from "@rebass/emotion";
import { BooleanValue } from "react-values";
import system from "@ehealth/system-components";
import isEmpty from "lodash/isEmpty";
import { loader } from "graphql.macro";
import { Trans, DateFormat } from "@lingui/macro";
import { PositiveIcon, NegativeIcon, DefaultImageIcon } from "@ehealth/icons";
import { getFullName, getPhones, handleMutation } from "@ehealth/utils";
import { Form, Modal, Switch } from "@ehealth/components";

import Line from "../../components/Line";
import Tabs from "../../components/Tabs";
import Link from "../../components/Link";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import LoadingOverlay from "../../components/LoadingOverlay";
import * as Field from "../../components/Field";
import EmptyData from "../../components/EmptyData";
import AddressView from "../../components/AddressView";
import Breadcrumbs from "../../components/Breadcrumbs";
import DictionaryValue from "../../components/DictionaryValue";
import DefinitionListView from "../../components/DefinitionListView";

import env from "../../env";

const DeclarationQuery = loader("../../graphql/DeclarationQuery.graphql");
const TerminateDeclarationMutation = loader(
  "../../graphql/TerminateDeclarationMutation.graphql"
);
const RejectDeclarationMutation = loader(
  "../../graphql/RejectDeclarationMutation.graphql"
);
const ApproveDeclarationMutation = loader(
  "../../graphql/ApproveDeclarationMutation.graphql"
);

const Details = ({ id }) => (
  <Query query={DeclarationQuery} variables={{ id }}>
    {({ loading, error, data: { declaration = {} } = {} }) => {
      if (error) return `Error! ${error.message}`;
      const {
        id,
        databaseId,
        declarationNumber,
        startDate,
        endDate,
        status,
        scope,
        reason,
        declarationRequestId,
        legalEntity,
        division,
        employee,
        person,
        declarationAttachedDocuments
      } = declaration;

      const general = {
        declarationNumber,
        startDate,
        endDate,
        status,
        scope,
        reason
      };

      return (
        <LoadingOverlay loading={loading}>
          <Box p={6}>
            <Box mb={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/declarations">
                  <Trans>Search for Declarations</Trans>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Trans>Declaration Details</Trans>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Flex justifyContent="space-between" alignItems="flex-end">
              <Box>
                <DefinitionListView
                  labels={{
                    databaseId: <Trans>Declaration ID</Trans>,
                    declarationRequestId: <Trans>Declaration request ID</Trans>,
                    status: <Trans>Status</Trans>
                  }}
                  data={{
                    databaseId,
                    declarationRequestId,
                    status: (
                      <Badge name={status} type="DECLARATION" minWidth={100} />
                    )
                  }}
                  color="#7F8FA4"
                  labelWidth="100px"
                />
              </Box>
              <Box>
                <Switch
                  value={status}
                  PENDING_VERIFICATION={
                    <Flex>
                      <Box mr={20}>
                        <Popup
                          variant="red"
                          buttonText={<Trans>Reject</Trans>}
                          title={<Trans>Declining declaration</Trans>}
                        >
                          {toggle => (
                            <Mutation
                              mutation={RejectDeclarationMutation}
                              refetchQueries={() => [
                                {
                                  query: DeclarationQuery,
                                  variables: {
                                    id
                                  }
                                }
                              ]}
                            >
                              {rejectDeclaration => (
                                <Flex justifyContent="center">
                                  <Box mr={20}>
                                    <Button variant="blue" onClick={toggle}>
                                      <Trans>Return</Trans>
                                    </Button>
                                  </Box>
                                  <Button
                                    onClick={async () => {
                                      try {
                                        await handleMutation(
                                          rejectDeclaration({
                                            variables: {
                                              input: { id }
                                            }
                                          })
                                        );
                                        toggle();
                                      } catch (errors) {
                                        return errors;
                                      }
                                    }}
                                    variant="red"
                                  >
                                    <Trans>Decline declaration</Trans>
                                  </Button>
                                </Flex>
                              )}
                            </Mutation>
                          )}
                        </Popup>
                      </Box>
                      <Popup
                        variant="green"
                        buttonText={<Trans>Approve</Trans>}
                        title={<Trans>Approval of the declaration</Trans>}
                      >
                        {toggle => (
                          <Mutation
                            mutation={ApproveDeclarationMutation}
                            refetchQueries={() => [
                              {
                                query: DeclarationQuery,
                                variables: {
                                  id
                                }
                              }
                            ]}
                          >
                            {approveDeclaration => (
                              <Flex justifyContent="center">
                                <Box mr={20}>
                                  <Button variant="blue" onClick={toggle}>
                                    <Trans>Return</Trans>
                                  </Button>
                                </Box>
                                <Button
                                  onClick={async () => {
                                    try {
                                      await handleMutation(
                                        approveDeclaration({
                                          variables: {
                                            input: { id }
                                          }
                                        })
                                      );
                                      toggle();
                                    } catch (errors) {
                                      return errors;
                                    }
                                  }}
                                  variant="green"
                                >
                                  <Trans>Approve the declaration</Trans>
                                </Button>
                              </Flex>
                            )}
                          </Mutation>
                        )}
                      </Popup>
                    </Flex>
                  }
                />
              </Box>
            </Flex>
          </Box>
          <Tabs.Nav>
            <Tabs.NavItem to="./">
              <Trans>General information</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./legal-entity">
              <Trans>Legal entity</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./divisions">
              <Trans>Division</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./employee">
              <Trans>Doctor</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./patient">
              <Trans>Patient</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./documents">
              <Trans>Documents</Trans>
            </Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Box p={5}>
              <Router>
                <GeneralInfo path="/" general={general} />
                <LegalEntity path="/legal-entity" legalEntity={legalEntity} />
                <Division path="/divisions" division={division} />
                <Employee path="/employee" employee={employee} />
                <Patient path="/patient" patient={person} />
                <Documents
                  path="/documents"
                  documents={declarationAttachedDocuments}
                />
              </Router>
            </Box>
          </Tabs.Content>
        </LoadingOverlay>
      );
    }}
  </Query>
);

const Popup = ({ variant, buttonText, title, children, render = children }) => (
  <BooleanValue>
    {({ value: opened, toggle }) => (
      <>
        <Button variant={variant} disabled={opened} onClick={toggle}>
          {buttonText}
        </Button>
        {opened && (
          <Modal width={760} backdrop>
            <Heading as="h1" fontWeight="normal" mb={6}>
              {title}
            </Heading>
            {render(toggle)}
          </Modal>
        )}
      </>
    )}
  </BooleanValue>
);

const GeneralInfo = ({
  id,
  general: { declarationNumber, startDate, endDate, status, reason, scope } = {}
}) => (
  <>
    <DefinitionListView
      labels={{
        declarationNumber: <Trans>Declaration number</Trans>,
        startDate: <Trans>Initial date of the declaration</Trans>,
        endDate: <Trans>End date of the declaration</Trans>
      }}
      data={{
        declarationNumber,
        startDate: <DateFormat value={startDate} />,
        endDate: <DateFormat value={endDate} />
      }}
    />
    {reason && (
      <>
        <Line />
        <DefinitionListView
          labels={{
            reason: <Trans>Status Comment</Trans>
          }}
          data={{
            reason
          }}
        />
        <Line />
      </>
    )}
    <DefinitionListView
      labels={{
        scope: <Trans>Type</Trans>
      }}
      data={{
        scope
      }}
    />
    {status === "ACTIVE" && (
      <Box mt={6}>
        <Popup
          variant="red"
          buttonText={<Trans>Terminate declaration</Trans>}
          title={<Trans>Declaration termination</Trans>}
        >
          {toggle => (
            <Mutation
              mutation={TerminateDeclarationMutation}
              refetchQueries={() => [
                {
                  query: DeclarationQuery,
                  variables: {
                    id
                  }
                }
              ]}
            >
              {terminateDeclaration => (
                <Form
                  onSubmit={async ({ reasonDescription }) => {
                    try {
                      await handleMutation(
                        terminateDeclaration({
                          variables: {
                            input: { id, reasonDescription }
                          }
                        })
                      );
                      toggle();
                    } catch (errors) {
                      return errors;
                    }
                  }}
                >
                  <Text mb={2}>
                    <Trans>
                      Attention! After declaration termination this action can
                      not be canceled
                    </Trans>
                  </Text>
                  <Trans
                    id="Enter terminate declaration reason"
                    render={({ translation }) => (
                      <Field.Textarea
                        name="reasonDescription"
                        placeholder={translation}
                        rows={5}
                        maxlength="3000"
                        showLengthHint
                      />
                    )}
                  />
                  <Flex justifyContent="center">
                    <Box mr={20}>
                      <Button variant="blue" onClick={toggle}>
                        <Trans>Return</Trans>
                      </Button>
                    </Box>
                    <Button type="submit" variant="red">
                      <Trans>Terminate declaration</Trans>
                    </Button>
                  </Flex>
                </Form>
              )}
            </Mutation>
          )}
        </Popup>
      </Box>
    )}
  </>
);

const LegalEntity = ({
  legalEntity: { id, databaseId, edrpou, publicName, addresses }
}) => {
  const [registrationAddress] = addresses.filter(
    a => a.type === "REGISTRATION"
  );
  return (
    <>
      <DefinitionListView
        labels={{
          edrpou: <Trans>EDRPOU</Trans>,
          publicName: <Trans>Name</Trans>,
          addresses: <Trans>Address</Trans>
        }}
        data={{
          edrpou,
          publicName,
          addresses: registrationAddress && (
            <AddressView data={registrationAddress} />
          )
        }}
      />
      <DefinitionListView
        labels={{
          databaseId: <Trans>Legal entity ID</Trans>,
          link: ""
        }}
        data={{
          databaseId,
          link: (
            <Link to={`/legal-entities/${id}`} fontWeight={700}>
              <Trans>Show detailed information</Trans>
            </Link>
          )
        }}
        color="#7F8FA4"
      />
    </>
  );
};

const Division = ({
  division: {
    id,
    databaseId,
    type,
    addresses,
    phones,
    mountainGroup,
    ...division
  }
}) => {
  const [residenceAddress] = addresses.filter(a => a.type === "RESIDENCE");
  return (
    <>
      <DefinitionListView
        labels={{
          name: <Trans>Name</Trans>,
          type: <Trans>Type</Trans>,
          addresses: <Trans>Address</Trans>,
          mountainGroup: <Trans>Mountain region</Trans>,
          phones: <Trans>Phone number</Trans>,
          email: <Trans>Email</Trans>
        }}
        data={{
          type: <DictionaryValue name="DIVISION_TYPE" item={type} />,
          addresses: residenceAddress && (
            <AddressView data={residenceAddress} />
          ),
          phones: getPhones(phones),
          mountainGroup: mountainGroup ? <PositiveIcon /> : null,
          ...division
        }}
      />
      <DefinitionListView
        labels={{
          databaseId: "ID відділення"
        }}
        data={{
          databaseId
        }}
        color="#7F8FA4"
      />
    </>
  );
};

const Employee = ({
  employee: {
    id,
    databaseId,
    position,
    party,
    additionalInfo: { specialities }
  }
}) => (
  <>
    <DefinitionListView
      labels={{
        fullName: <Trans>Full name</Trans>,
        speciality: <Trans>Specialty</Trans>,
        position: <Trans>Position</Trans>
      }}
      data={{
        fullName: getFullName(party),
        speciality: specialities && (
          <DictionaryValue
            name="SPECIALITY_TYPE"
            item={
              specialities.find(item => item.specialityOfficio && item)
                .speciality
            }
          />
        ),
        position: <DictionaryValue name="POSITION" item={position} />
      }}
    />
    <DefinitionListView
      labels={{
        databaseId: <Trans>Employee ID</Trans>,
        link: ""
      }}
      data={{
        databaseId,
        link: (
          <Link
            is="a"
            href={`${env.REACT_APP_ADMIN_LEGACY_URL}/employees/${id}`}
            fontWeight={700}
          >
            <Trans>Show detailed information</Trans>
          </Link>
        )
      }}
      color="#7F8FA4"
    />
  </>
);

const Patient = ({
  patient: {
    id,
    databaseId,
    birthDate,
    taxId,
    phones,
    birthCountry,
    birthSettlement,
    unzr,
    noTaxId,
    ...fullName
  }
}) => (
  <>
    <DefinitionListView
      labels={{
        fullName: <Trans>Full name</Trans>,
        birthDate: <Trans>Date of birth</Trans>,
        birthCountry: <Trans>Country of birth</Trans>,
        birthSettlement: <Trans>Place of birth</Trans>,
        unzr: <Trans>Record ID in EDDR</Trans>,
        taxId: <Trans>INN</Trans>,
        noTaxId: <Trans>No tax ID</Trans>,
        phones: <Trans>Phone number</Trans>
      }}
      data={{
        fullName: getFullName(fullName),
        birthDate: <DateFormat value={birthDate} />,
        birthCountry,
        birthSettlement,
        unzr,
        taxId,
        noTaxId: noTaxId ? (
          <NegativeIcon fill="#ED1C24" stroke="#ED1C24" />
        ) : null,
        phones: getPhones(phones)
      }}
    />
    <DefinitionListView
      labels={{
        databaseId: <Trans>Patient ID</Trans>,
        link: ""
      }}
      data={{
        databaseId,
        link: (
          <Link to={`/persons/${id}`} fontWeight={700}>
            <Trans>Show detailed information</Trans>
          </Link>
        )
      }}
      color="#7F8FA4"
    />
  </>
);

//TODO: pass Documents to the separate component
const Documents = ({ documents }) =>
  !isEmpty(documents) ? (
    documents.map(({ url, type }) => (
      <Box m="2">
        <SaveLink href={url} target="_blank">
          <Box m={1} color="shiningKnight">
            <DefaultImageIcon />
          </Box>
          <Text color="rockmanBlue" lineHeight="1">
            <DictionaryValue name="CONTRACT_DOCUMENT" item={type} />
          </Text>
        </SaveLink>
      </Box>
    ))
  ) : (
    <EmptyData />
  );

const SaveLink = system(
  {
    is: "a"
  },
  {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    lineHeight: 0,
    textDecoration: "none"
  }
);

export default Details;
