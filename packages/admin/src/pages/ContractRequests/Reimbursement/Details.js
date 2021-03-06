import React from "react";
import { Router, Link } from "@reach/router";
import { Query } from "react-apollo";
import { Flex, Box, Text } from "@rebass/emotion";
import system from "@ehealth/system-components";
import printIframe from "print-iframe";
import { loader } from "graphql.macro";
import format from "date-fns/format";
import isEmpty from "lodash/isEmpty";
import { Trans } from "@lingui/macro";
import { Switch } from "@ehealth/components";
import { PrinterIcon, DefaultImageIcon } from "@ehealth/icons";
import { getFullName, formatWorkingHours } from "@ehealth/utils";

import Line from "../../../components/Line";
import Tabs from "../../../components/Tabs";
import Table from "../../../components/Table";
import LinkComponent from "../../../components/Link";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import AddressView from "../../../components/AddressView";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DictionaryValue from "../../../components/DictionaryValue";
import DefinitionListView from "../../../components/DefinitionListView";
import ModalAssigneeSearch from "../../../components/ModalAssigneeSearch";
import EmptyData from "../../../components/EmptyData";
import WEEK_DAYS from "../../../helpers/weekDays";

import Approve from "./Approve";
import Update from "./Update";
import Decline from "./Decline";
import PrintOutContent from "./PrintOutContent";
import STATUSES from "../../../helpers/statuses";

const ReimbursementContractRequestQuery = loader(
  "../../../graphql/ReimbursementContractRequestQuery.graphql"
);

const ReimbursementContractRequestDetails = () => (
  <Router>
    <Details path=":id/*" />
    <Update path=":id/update/*" />
    <Approve path=":id/approve/*" />
    <Decline path=":id/decline/*" />
    <PrintOutContent path=":id/print-out-content/*" />
  </Router>
);

const Details = ({ id }) => (
  <Query query={ReimbursementContractRequestQuery} variables={{ id }}>
    {({ loading, error, data: { reimbursementContractRequest = {} } }) => {
      if (isEmpty(reimbursementContractRequest)) return null;
      const {
        databaseId,
        status,
        assignee,
        printoutContent: content,
        startDate,
        endDate,
        nhsSigner,
        nhsSignerBase,
        nhsPaymentMethod,
        issueCity,
        contractorLegalEntity,
        contractorOwner,
        contractorBase,
        contractorPaymentDetails,
        contractorDivisions,
        attachedDocuments,
        previousRequest,
        medicalProgram,
        statusReason
      } = reimbursementContractRequest;
      const { party = "" } = assignee ? assignee : {};
      return (
        <>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/contract-requests/reimbursement">
                  <Trans>Contract requests list</Trans>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Trans>Contract request details</Trans>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Flex justifyContent="space-between">
              <Box>
                <DefinitionListView
                  labels={{
                    id: <Trans>Contract request ID</Trans>,
                    previousRequestId: <Trans>Previous request ID</Trans>,
                    status: <Trans>Status</Trans>,
                    assignee: <Trans>Performer</Trans>
                  }}
                  data={{
                    id: databaseId,
                    previousRequestId: previousRequest && (
                      <LinkComponent
                        to={`/contract-requests/reimbursement/${
                          previousRequest.id
                        }`}
                      >
                        {previousRequest.databaseId}
                      </LinkComponent>
                    ),
                    status: (
                      <Badge
                        name={status}
                        type="CONTRACT_REQUEST"
                        minWidth={100}
                      />
                    ),
                    assignee: (
                      <Switch
                        value={status}
                        NEW={
                          <ModalAssigneeSearch
                            submitted={getFullName(party)}
                            id={id}
                            query={ReimbursementContractRequestQuery}
                          />
                        }
                        IN_PROCESS={
                          <ModalAssigneeSearch
                            submitted={getFullName(party)}
                            id={id}
                            query={ReimbursementContractRequestQuery}
                          />
                        }
                        default={assignee && getFullName(party)}
                      />
                    )
                  }}
                  color="#7F8FA4"
                  labelWidth="100px"
                />
              </Box>
              <Switch
                value={status}
                IN_PROCESS={
                  <Flex alignItems="flex-end">
                    <Flex>
                      <Box mr={2}>
                        <Link to="decline">
                          <Button variant="red">
                            <Trans>Reject</Trans>
                          </Button>
                        </Link>
                      </Box>
                      <Link to="update">
                        <Button variant="green">
                          <Trans>Approve</Trans>
                        </Button>
                      </Link>
                    </Flex>
                  </Flex>
                }
                PENDING_NHS_SIGN={
                  <Flex
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="flex-end"
                  >
                    <PrintButton content={content} />
                    <Link to="./print-out-content">
                      <Button variant="green">
                        <Trans>Sign</Trans>
                      </Button>
                    </Link>
                  </Flex>
                }
                NHS_SIGNED={<PrintButton content={content} />}
                SIGNED={<PrintButton content={content} />}
              />
            </Flex>
          </Box>

          <Tabs.Nav>
            <Tabs.NavItem to="./">
              <Trans>General information</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./legal-entity">
              <Trans>Pharmacy</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./divisions">
              <Trans>Subdivision</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./documents">
              <Trans>Documents</Trans>
            </Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Router>
              <GeneralInfo
                path="/"
                startDate={startDate}
                endDate={endDate}
                nhsSigner={nhsSigner}
                nhsSignerBase={nhsSignerBase}
                nhsPaymentMethod={nhsPaymentMethod}
                issueCity={issueCity}
                medicalProgram={medicalProgram}
                statusReason={statusReason}
              />
              <LegalEntity
                path="/legal-entity"
                contractorOwner={contractorOwner}
                contractorBase={contractorBase}
                contractorLegalEntity={contractorLegalEntity}
                contractorPaymentDetails={contractorPaymentDetails}
              />
              <Divisions
                path="/divisions"
                contractorDivisions={contractorDivisions}
              />
              <Documents
                path="/documents"
                attachedDocuments={attachedDocuments}
              />
            </Router>
          </Tabs.Content>
        </>
      );
    }}
  </Query>
);

const GeneralInfo = ({
  nhsSigner,
  nhsSignerBase,
  nhsPaymentMethod,
  issueCity,
  startDate,
  endDate,
  medicalProgram,
  statusReason
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        nhsSignerName: <Trans>Signer name</Trans>,
        nhsSignerBase: <Trans>Signer base</Trans>,
        nhsPaymentMethod: <Trans>Payment method</Trans>,
        issueCity: <Trans>The city of the conclusion of the contract</Trans>
      }}
      data={{
        nhsSignerName: nhsSigner ? getFullName(nhsSigner.party) : null,
        nhsSignerBase,
        nhsPaymentMethod: nhsPaymentMethod && (
          <DictionaryValue
            name="CONTRACT_PAYMENT_METHOD"
            item={nhsPaymentMethod}
          />
        ),
        issueCity
      }}
    />
    {nhsSigner && <Line />}
    <DefinitionListView
      labels={{
        startDate: <Trans>Initial date of the contract</Trans>,
        endDate: <Trans>Expiry date of the contract</Trans>
      }}
      data={{
        startDate: format(startDate, "DD.MM.YYYY"),
        endDate: format(endDate, "DD.MM.YYYY")
      }}
    />
    {!isEmpty(medicalProgram) && (
      <>
        <Line />
        <DefinitionListView
          labels={{
            name: <Trans>Medical program</Trans>
          }}
          data={{
            name: medicalProgram.name
          }}
        />
        <DefinitionListView
          color="blueberrySoda"
          labels={{
            name: <Trans>Medical program ID</Trans>
          }}
          data={{
            name: medicalProgram.databaseId
          }}
        />
      </>
    )}
    {statusReason && (
      <>
        <Line />
        <DefinitionListView
          labels={{
            statusReason: <Trans>Status Comment</Trans>
          }}
          data={{
            statusReason
          }}
        />
      </>
    )}
  </Box>
);

const LegalEntity = ({
  contractorBase,
  contractorOwner,
  contractorPaymentDetails,
  contractorLegalEntity
}) => {
  const { bankName, mfo, payerAccount } = contractorPaymentDetails || {};
  const {
    databaseId: legalEntityDatabaseId,
    id: legalEntityId,
    name,
    edrpou,
    addresses = []
  } = contractorLegalEntity || {};

  return (
    <Box p={5}>
      <DefinitionListView
        labels={{
          edrpou: <Trans>EDRPOU</Trans>,
          name: <Trans>Name</Trans>,
          addresses: <Trans>Address</Trans>
        }}
        data={{
          name: name,
          edrpou: edrpou,
          addresses: addresses
            .filter(a => a.type === "REGISTRATION")
            .map((item, key) => <AddressView data={item} key={key} />)
        }}
      />
      <DefinitionListView
        color="blueberrySoda"
        labels={{
          legalEntityId: "ID аптеки"
        }}
        data={{
          legalEntityId: (
            <LinkComponent to={`/legal-entities/${legalEntityId}`}>
              {legalEntityDatabaseId}
            </LinkComponent>
          )
        }}
      />
      <Line />
      <DefinitionListView
        labels={{
          fullName: <Trans>Subscriber Name</Trans>,
          contractorBase: <Trans>Based on</Trans>
        }}
        data={{
          fullName: contractorOwner && getFullName(contractorOwner.party),
          contractorBase: contractorBase
        }}
      />
      <DefinitionListView
        color="blueberrySoda"
        labels={{
          ownerId: <Trans>Signer ID</Trans>
        }}
        data={{
          ownerId: contractorOwner && contractorOwner.databaseId
        }}
      />
      <Line />
      <DefinitionListView
        labels={{
          bankName: <Trans>Bank</Trans>,
          mfo: <Trans>Bank Code (MFO)</Trans>,
          payerAccount: <Trans>Account number</Trans>
        }}
        data={{
          bankName,
          mfo,
          payerAccount
        }}
      />
    </Box>
  );
};

const Divisions = ({ contractorDivisions }) =>
  !isEmpty(contractorDivisions) ? (
    <Table
      data={contractorDivisions}
      header={{
        name: <Trans>Division name</Trans>,
        addresses: <Trans>Address</Trans>,
        phones: (
          <>
            <Trans>Phone</Trans>
            <br />
            <Trans>Email</Trans>
          </>
        ),
        dlsVerified: <Trans>DLS Verification</Trans>,
        workingHours: <Trans>Work schedule</Trans>
      }}
      renderRow={({
        name,
        addresses = [],
        workingHours,
        phones = [],
        email,
        dlsVerified
      }) => ({
        name,
        phones: (
          <>
            <Box>
              {phones
                .filter(a => a.type === "MOBILE")
                .map((item, key) => item.number)[0] || phones[0].number}
            </Box>
            <Box>{email}</Box>
          </>
        ),
        dlsVerified: (
          <Flex justifyContent="center">{STATUSES.YES_NO[dlsVerified]}</Flex>
        ),
        workingHours:
          workingHours &&
          formatWorkingHours(WEEK_DAYS, workingHours).map(({ day, hours }) => (
            <Box pb={2}>
              {day}: {hours.map(i => i.join("-")).join(", ")}
            </Box>
          )),
        addresses: addresses
          .filter(a => a.type === "RESIDENCE")
          .map((item, key) => <AddressView data={item} key={key} />)
      })}
      tableName="/reimbursement-contract-requests/divisions"
      hiddenFields="workingHours"
      hidePagination
    />
  ) : (
    <EmptyData />
  );

const Documents = ({ attachedDocuments }) =>
  !isEmpty(attachedDocuments) ? (
    attachedDocuments.map(({ url, type }) => (
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

const PrintButton = ({ content }) => (
  <Wrapper color="shiningKnight" onClick={() => printIframe(content)}>
    <Text color="rockmanBlue" fontWeight="bold" mr={1} fontSize="0">
      <Trans>Show printout form</Trans>
    </Text>
    <PrinterIcon />
  </Wrapper>
);

const Wrapper = system(
  {
    extend: Flex
  },
  { cursor: "pointer" },
  "color"
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
    textDecoration: "none",
    fontSize: 14
  }
);

export default ReimbursementContractRequestDetails;
