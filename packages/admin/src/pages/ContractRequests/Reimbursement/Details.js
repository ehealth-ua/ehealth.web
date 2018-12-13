import React from "react";
import { Router, Link } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { Flex, Box, Text } from "rebass/emotion";
import system from "system-components/emotion";
import printIframe from "print-iframe";
import { BooleanValue } from "react-values";
import { Manager, Reference, Popper } from "react-popper";
import { loader } from "graphql.macro";
import format from "date-fns/format";
import isEmpty from "lodash/isEmpty";

import { Form, Switch } from "@ehealth/components";
import { boolean } from "@ehealth/system-tools";
import {
  PrinterIcon,
  PositiveIcon,
  NegativeIcon,
  DefaultImageIcon,
  DropDownButton
} from "@ehealth/icons";
import { getFullName, formatWorkingHours } from "@ehealth/utils";

import Line from "../../../components/Line";
import Tabs from "../../../components/Tabs";
import Table from "../../../components/Table";
import LinkComponent from "../../../components/Link";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import * as Field from "../../../components/Field";
import AddressView from "../../../components/AddressView";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { SearchIcon } from "../../../components/MultiSelectView";
import DefinitionListView from "../../../components/DefinitionListView";
import WEEK_DAYS from "../../../helpers/weekDays";

import Approve from "./Approve";
import Update from "./Update";
import Decline from "./Decline";

const ReimbursementContractRequestQuery = loader(
  "../../../graphql/ReimbursementContractRequestQuery.graphql"
);
const AssignContractRequestMutation = loader(
  "../../../graphql/AssignContractRequestMutation.graphql"
);
const EmployeesQuery = loader("../../../graphql/EmployeesQuery.graphql");

const ReimbursementContractRequestDetails = () => (
  <Router>
    <Details path=":id/*" />
    <Update path=":id/update/*" />
    <Approve path=":id/approve/*" />
    <Decline path=":id/decline/*" />
  </Router>
);

const Details = ({ id }) => (
  <Query query={ReimbursementContractRequestQuery} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
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
        nhsPaymentMethod,
        issueCity,
        contractorLegalEntity,
        contractorOwner,
        contractorBase,
        contractorPaymentDetails,
        contractorDivisions,
        attachedDocuments,
        previousRequest,
        medicalProgram
      } = data.reimbursementContractRequest;

      const { party = "" } = assignee ? assignee : {};

      return (
        <>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/contract-requests/reimbursement">
                  Перелік заяв
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>Деталі заяви</Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Flex justifyContent="space-between">
              <Box>
                <DefinitionListView
                  labels={{
                    id: "ID заяви",
                    previousRequestId: "ID попередньої заяви",
                    status: "Статус",
                    assignee: "Виконавець"
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
                          <ModalSelect submitted={getFullName(party)} id={id} />
                        }
                        IN_PROCESS={
                          <ModalSelect submitted={getFullName(party)} id={id} />
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
                          <Button variant="red">Відхилити</Button>
                        </Link>
                      </Box>
                      <Link to="update">
                        <Button variant="green">Затвердити</Button>
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
                      <Button variant="green">Підписати</Button>
                    </Link>
                  </Flex>
                }
                NHS_SIGNED={<PrintButton content={content} />}
                SIGNED={<PrintButton content={content} />}
              />
            </Flex>
          </Box>

          <Tabs.Nav>
            <Tabs.NavItem to="./">Загальна інформація</Tabs.NavItem>
            <Tabs.NavItem to="./legal-entity">Аптека</Tabs.NavItem>
            <Tabs.NavItem to="./divisions">Відділення</Tabs.NavItem>
            <Tabs.NavItem to="./documents">Документи</Tabs.NavItem>
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
  medicalProgram
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        nhsSignerName: "Ім'я підписанта",
        nhsSignerBase: "Підстава",
        nhsPaymentMethod: "Спосіб оплати",
        issueCity: "Місто укладення договору"
      }}
      data={{
        nhsSignerName: nhsSigner ? getFullName(nhsSigner.party) : null,
        nhsSignerBase,
        nhsPaymentMethod,
        issueCity
      }}
    />
    {nhsSigner && <Line />}
    <DefinitionListView
      labels={{
        startDate: "Початкова дата дії контракту",
        endDate: "Кінцева дата дії контракту"
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
            name: "Медична програма"
          }}
          data={{
            name: medicalProgram.name
          }}
        />
        <DefinitionListView
          color="blueberrySoda"
          labels={{
            name: (
              <>
                ID медичної
                <br />
                програми
              </>
            )
          }}
          data={{
            name: medicalProgram.databaseId
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
          edrpou: "ЄДРПОУ",
          name: "Назва",
          addresses: "Адреса"
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
          fullName: "ПІБ підписанта",
          contractorBase: "Діє на основі"
        }}
        data={{
          fullName: contractorOwner && getFullName(contractorOwner.party),
          contractorBase: contractorBase
        }}
      />
      <DefinitionListView
        color="blueberrySoda"
        labels={{
          ownerId: "ID підписанта"
        }}
        data={{
          ownerId: contractorOwner && contractorOwner.databaseId
        }}
      />
      <Line />
      <DefinitionListView
        labels={{
          bankName: "Банк",
          mfo: "Код банку (МФО)",
          payerAccount: "Номер рахунку"
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
  !isEmpty(contractorDivisions) && (
    <Table
      data={contractorDivisions}
      header={{
        name: "Назва відділення",
        addresses: "Адреса",
        mountainGroup: "Гірський регіон",
        phones: (
          <>
            Телефон <br />
            Email
          </>
        ),
        workingHours: "Графік роботи"
      }}
      renderRow={({
        name,
        addresses = [],
        mountainGroup,
        workingHours,
        phones = [],
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
      tableName="/reimbursement-contract-requests/divisions"
      hiddenFields="workingHours"
    />
  );

const Documents = ({ attachedDocuments }) =>
  !isEmpty(attachedDocuments) &&
  attachedDocuments.map(({ url, type }) => (
    <Box m="2">
      <SaveLink href={url} target="_blank">
        <Box m={1} color="shiningKnight">
          <DefaultImageIcon />
        </Box>
        <Text color="rockmanBlue" lineHeight="1">
          {type}
        </Text>
      </SaveLink>
    </Box>
  ));

const PrintButton = ({ content }) => (
  <Wrapper color="shiningKnight" onClick={() => printIframe(content)}>
    <Text color="rockmanBlue" fontWeight="bold" mr={1} fontSize="1">
      Дивитись друковану форму
    </Text>
    <PrinterIcon />
  </Wrapper>
);

const ModalSelect = ({ submitted, id }) => (
  <Query
    query={EmployeesQuery}
    variables={{
      first: 50,
      filter: {
        employeeType: ["NHS", "NHS_SIGNER"],
        status: "APPROVED"
      },
      orderBy: "INSERTED_AT_DESC"
    }}
  >
    {({
      loading,
      error,
      data: { employees: { nodes: employees = [] } = {} } = {}
    }) => (
      <BooleanValue>
        {({ value: opened, toggle }) => (
          <Form onSubmit={() => null}>
            <Mutation
              mutation={AssignContractRequestMutation}
              refetchQueries={() => [
                {
                  query: ReimbursementContractRequestQuery,
                  variables: { id }
                }
              ]}
            >
              {assignContractRequest => (
                <Form.AutoSubmit
                  onSubmit={async ({ assignee }) => {
                    assignee &&
                      (await assignContractRequest({
                        variables: {
                          input: {
                            id,
                            employeeId: assignee.id
                          }
                        }
                      }).then(toggle));
                  }}
                />
              )}
            </Mutation>
            <Manager>
              <Reference>
                {({ ref }) => (
                  <Flex innerRef={ref} alignItems="center">
                    {submitted}
                    <ButtonWrapper onClick={toggle}>
                      {!submitted && <DropDownButton color="#2EA2F8" />}
                      <ButtonText>
                        {!submitted ? "Додати виконавця" : "Змінити"}
                      </ButtonText>
                    </ButtonWrapper>
                  </Flex>
                )}
              </Reference>
              <Popper placement="bottom-start" positionFixed>
                {({ ref, style }) => (
                  <ModalWrapper style={style} innerRef={ref} visible={opened}>
                    <Field.Select
                      name="assignee"
                      items={employees}
                      renderItem={item => getFullName(item.party)}
                      itemToString={item => {
                        if (!item) return "";
                        return typeof item === "string"
                          ? item
                          : getFullName(item.party);
                      }}
                      filterOptions={{ keys: ["party.lastName"] }}
                      hideErrors
                      iconComponent={SearchIcon}
                      style={{ margin: "5px", border: "1px solid #DFE3E9" }}
                    />
                  </ModalWrapper>
                )}
              </Popper>
            </Manager>
          </Form>
        )}
      </BooleanValue>
    )}
  </Query>
);

const ModalWrapper = system(
  {
    width: 245,
    mt: 2,
    fontSize: 1,
    color: "darkAndStormy"
  },
  {
    zIndex: 100,
    visibility: "hidden",
    boxShadow: "0 1px 4px rgba(72, 60, 60, 0.2)"
  },
  boolean({
    prop: "visible",
    key: "inputs.select.visible"
  })
);

const ButtonWrapper = system(
  {
    display: "flex"
  },
  {
    cursor: "pointer"
  }
);

const ButtonText = system({
  is: "span",
  ml: 2,
  color: "rockmanBlue",
  fontSize: 0,
  fontWeight: 700
});

const Wrapper = system(
  {
    is: Flex
  },
  { cursor: "pointer" }
);

const SaveLink = system(
  {
    is: "a",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    lineHeight: 0
  },
  { textDecoration: "none" }
);

export default ReimbursementContractRequestDetails;
