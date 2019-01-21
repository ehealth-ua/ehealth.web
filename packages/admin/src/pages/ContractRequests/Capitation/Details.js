import React from "react";
import { Router, Link } from "@reach/router";
import { Query } from "react-apollo";
import { Flex, Box, Text } from "@rebass/emotion";
import system from "@ehealth/system-components";
import printIframe from "print-iframe";
import { BooleanValue } from "react-values";
import { loader } from "graphql.macro";

import { DateFormat, Trans } from "@lingui/macro";
import { Switch } from "@ehealth/components";
import {
  PrinterIcon,
  PositiveIcon,
  NegativeIcon,
  DefaultImageIcon
} from "@ehealth/icons";
import {
  getFullName,
  filterTableColumn as filterTableDefaultColumn,
  formatWorkingHours
} from "@ehealth/utils";

import Update from "./Update";
import Approve from "./Approve";
import Decline from "./Decline";
import PrintOutContent from "./PrintOutContent";

import Line from "../../../components/Line";
import Tabs from "../../../components/Tabs";
import Table, {
  TableBodyComponent,
  TableRow,
  TableCell
} from "../../../components/Table";
import LinkComponent from "../../../components/Link";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import LoadingOverlay from "../../../components/LoadingOverlay";
import AddressView from "../../../components/AddressView";
import DictionaryValue from "../../../components/DictionaryValue";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DefinitionListView from "../../../components/DefinitionListView";
import ModalAssigneeSearch from "../../../components/ModalAssigneeSearch";
import WEEK_DAYS from "../../../helpers/weekDays";

const CapitationContractRequestQuery = loader(
  "../../../graphql/CapitationContractRequestQuery.graphql"
);

const CapitationContractRequestsDetails = () => (
  <Router>
    <Details path=":id/*" />
    <Update path=":id/update/*" />
    <Approve path=":id/approve/*" />
    <Decline path=":id/decline/*" />
    <PrintOutContent path=":id/print-out-content/*" />
  </Router>
);

const Details = ({ id }) => (
  <Query
    query={CapitationContractRequestQuery}
    fetchPolicy="network-only"
    variables={{ id }}
  >
    {({ loading, error, data: { capitationContractRequest = {} } = {} }) => {
      if (error) return `Error! ${error.message}`;
      const {
        databaseId,
        status,
        assignee,
        printoutContent: content,
        startDate,
        endDate,
        nhsSigner,
        nhsSignerBase,
        nhsContractPrice,
        nhsPaymentMethod,
        issueCity,
        contractorRmspAmount,
        contractorLegalEntity,
        contractorOwner,
        contractorBase,
        contractorPaymentDetails,
        contractorDivisions,
        contractorEmployeeDivisions,
        externalContractors,
        attachedDocuments,
        previousRequest,
        statusReason
      } = capitationContractRequest;

      const { party = "" } = assignee ? assignee : {};

      return (
        <LoadingOverlay loading={loading}>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/contract-requests">
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
                        to={`/contract-requests/capitation/${
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
                            query={CapitationContractRequestQuery}
                          />
                        }
                        IN_PROCESS={
                          <ModalAssigneeSearch
                            submitted={getFullName(party)}
                            id={id}
                            query={CapitationContractRequestQuery}
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
              <Trans>Legal entity</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./divisions">
              <Trans>Division</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./employees">
              <Trans>Doctors</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./external-contractors">
              <Trans>Contractors</Trans>
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
                nhsContractPrice={nhsContractPrice}
                nhsPaymentMethod={nhsPaymentMethod}
                issueCity={issueCity}
                contractorRmspAmount={contractorRmspAmount}
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
              <Employees
                path="/employees"
                contractorEmployeeDivisions={contractorEmployeeDivisions}
              />
              <ExternalContractors
                path="/external-contractors"
                externalContractors={externalContractors}
              />
              <Documents
                path="/documents"
                attachedDocuments={attachedDocuments}
              />
            </Router>
          </Tabs.Content>
        </LoadingOverlay>
      );
    }}
  </Query>
);

const GeneralInfo = ({
  nhsSigner,
  nhsSignerBase,
  nhsContractPrice,
  nhsPaymentMethod,
  issueCity,
  contractorRmspAmount,
  statusReason,
  startDate,
  endDate
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        nhsSignerName: <Trans>Signer name</Trans>,
        nhsSignerBase: <Trans>Signer base</Trans>,
        nhsContractPrice: <Trans>Contract Price</Trans>,
        nhsPaymentMethod: <Trans>Payment method</Trans>,
        issueCity: <Trans>The city of the conclusion of the contract</Trans>
      }}
      data={{
        nhsSignerName: nhsSigner ? getFullName(nhsSigner.party) : null,
        nhsSignerBase,
        nhsContractPrice,
        nhsPaymentMethod: (
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
        startDate: <DateFormat value={startDate} />,
        endDate: <DateFormat value={endDate} />
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        contractorRmspAmount: (
          <Trans>Number of persons served by legal entity</Trans>
        )
      }}
      data={{
        contractorRmspAmount: (
          <>
            {contractorRmspAmount}
            <Grey>(станом на 01.01.2018)</Grey>
          </>
        )
      }}
    />
    {statusReason && <Line />}
    <DefinitionListView
      labels={{
        statusReason: <Trans>Status Comment</Trans>
      }}
      data={{
        statusReason
      }}
    />
  </Box>
);

const LegalEntity = ({
  contractorBase,
  contractorOwner,
  contractorPaymentDetails: { bankName, mfo, payerAccount },
  contractorLegalEntity: {
    databaseId: legalEntityDatabaseId,
    id: legalEntityId,
    name,
    edrpou,
    addresses
  }
}) => (
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
        legalEntityId: <Trans>Legal entity ID</Trans>
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

const Divisions = ({ contractorDivisions }) =>
  contractorDivisions && contractorDivisions.length > 0 ? (
    <Table
      data={contractorDivisions}
      header={{
        name: <Trans>Division name</Trans>,
        addresses: <Trans>Address</Trans>,
        mountainGroup: <Trans>Mountain region</Trans>,
        workingHours: <Trans>Work schedule</Trans>,
        phones: (
          <>
            <Trans>Phone</Trans>
            <br />
            <Trans>Email</Trans>
          </>
        )
      }}
      renderRow={({
        name,
        addresses,
        mountainGroup,
        workingHours,
        phones,
        email
      }) => ({
        name,
        mountainGroup: (
          <Flex justifyContent="center">
            {mountainGroup ? <PositiveIcon /> : <NegativeIcon />}
          </Flex>
        ),
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
      tableName="/capitation-contract-requests/divisions"
      hiddenFields="workingHours"
    />
  ) : (
    <EmptyData />
  );

const Employees = ({ contractorEmployeeDivisions }) =>
  contractorEmployeeDivisions && contractorEmployeeDivisions.length > 0 ? (
    <Table
      data={contractorEmployeeDivisions}
      header={{
        databaseId: <Trans>ID</Trans>,
        divisionName: <Trans>Division name</Trans>,
        employeeName: <Trans>Name of employee</Trans>,
        speciality: <Trans>Specialty</Trans>,
        staffUnits: <Trans>Permanent unit</Trans>,
        declarationLimit: <Trans>Declarations limit</Trans>
      }}
      renderRow={({
        employee: {
          databaseId,
          party,
          additionalInfo: { specialities }
        },
        division: { name: divisionName },
        ...contractorEmployeeDivisions
      }) => ({
        databaseId,
        divisionName,
        employeeName: getFullName(party),
        speciality: (
          <DictionaryValue
            name="SPECIALITY_TYPE"
            item={
              specialities.find(item => item.specialityOfficio && item)
                .speciality
            }
          />
        ),
        ...contractorEmployeeDivisions
      })}
      tableName="/capitation-contract-requests/employees"
      whiteSpaceNoWrap={["databaseId"]}
    />
  ) : (
    <EmptyData />
  );

const ExternalContractors = ({ externalContractors }) =>
  externalContractors && externalContractors.length > 0 ? (
    <>
      <Text px={6} pt={2} fontSize={1}>
        <Trans>To see the services, click on "Show division"</Trans>
      </Text>
      <ExternalContractorsTable data={externalContractors} />
    </>
  ) : (
    <EmptyData />
  );

const Documents = ({ attachedDocuments }) =>
  attachedDocuments ? (
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

const ExternalContractorsTable = ({ data }) => (
  <Table
    data={data}
    header={{
      name: <Trans>Legal entity</Trans>,
      divisions: <Trans>Division and Services</Trans>,
      number: <Trans>Contract Number</Trans>,
      issuedAt: <Trans>Contract start date</Trans>,
      expiresAt: <Trans>Contract end date</Trans>
    }}
    tableName="/capitation-contract-requests/external-contractors"
    tableBody={({
      columns,
      data,
      rowKeyExtractor,
      columnKeyExtractor,
      filterTableColumn = filterTableDefaultColumn,
      filterRow,
      whiteSpaceNoWrap = []
    }) => {
      const renderRow = (
        {
          legalEntity: { name },
          contract: { number, issuedAt, expiresAt },
          divisions
        },
        onClick
      ) => ({
        name,
        number,
        issuedAt,
        expiresAt,
        divisions: (
          <Wrapper onClick={onClick}>
            <Text color="rockmanBlue" fontWeight="bold" mr={1} fontSize={0}>
              <Trans>Show division</Trans>({divisions.length})
            </Text>
          </Wrapper>
        )
      });

      return (
        <TableBodyComponent>
          {data.map((item, index) => (
            <BooleanValue>
              {({ value: opened, toggle }) => {
                const row = renderRow(item, toggle);
                return (
                  <>
                    <TableRow key={rowKeyExtractor(item, index)}>
                      {columns
                        .filter(bodyName =>
                          filterTableColumn(filterRow, bodyName)
                        )
                        .map((name, index) => (
                          <TableCell key={columnKeyExtractor(name, index)}>
                            {row[name]}
                          </TableCell>
                        ))}
                    </TableRow>
                    {opened && (
                      <TableRow
                        key={`row_${rowKeyExtractor(item, index)}`}
                        fullSize
                      >
                        <TableCell
                          key={`cell_${rowKeyExtractor(item, index)}`}
                          colSpan={
                            columns.filter(bodyName =>
                              filterTableColumn(filterRow, bodyName)
                            ).length
                          }
                          fullSize
                        >
                          <Table
                            data={item.divisions}
                            header={{
                              name: "",
                              medicalService: ""
                            }}
                            renderRow={({
                              division: { name },
                              medicalService
                            }) => ({
                              name,
                              medicalService: (
                                <DictionaryValue
                                  name="MEDICAL_SERVICE"
                                  item={medicalService}
                                />
                              )
                            })}
                            tableName="/capitation-contract-requests/ExternalContractorsTable"
                            headless
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              }}
            </BooleanValue>
          ))}
        </TableBodyComponent>
      );
    }}
  />
);

const PrintButton = ({ content }) => (
  <Wrapper color="shiningKnight" onClick={() => printIframe(content)}>
    <Text color="rockmanBlue" fontWeight="bold" mr={1} fontSize="0">
      <Trans>Show printout form</Trans>
    </Text>
    <PrinterIcon />
  </Wrapper>
);

const EmptyData = props => (
  <WrapperBoxHeight>
    <Text color="shiningKnight" {...props} fontSize={1} mx={6} my={2}>
      <Trans>No info</Trans>
    </Text>
  </WrapperBoxHeight>
);
const WrapperBoxHeight = system(
  {
    is: Box,
    height: 500
  },
  "height"
);

const Wrapper = system(
  {
    extend: Flex
  },
  { cursor: "pointer" },
  "color"
);

const Grey = system(
  {
    color: "blueberrySoda"
  },
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

export default CapitationContractRequestsDetails;
