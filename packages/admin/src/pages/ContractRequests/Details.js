import React from "react";
import { Router, Link } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { Flex, Box, Text } from "rebass/emotion";
import system from "system-components/emotion";
import printIframe from "print-iframe";
import { BooleanValue } from "react-values";
import { Manager, Reference, Popper } from "react-popper";

import { Form, Switch } from "@ehealth/components";
import { boolean } from "@ehealth/system-tools";
import {
  PrinterIcon,
  PositiveIcon,
  DefaultImageIcon,
  DropDownButton,
  CircleIcon
} from "@ehealth/icons";
import {
  getFullName,
  filterTableColumn as filterTableDefaultColumn,
  formatWorkingHours
} from "@ehealth/utils";

import Line from "../../components/Line";
import Tabs from "../../components/Tabs";
import Table, {
  TableBodyComponent,
  TableRow,
  TableCell
} from "../../components/Table";
import LinkComponent from "../../components/Link";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import AddressView from "../../components/AddressView";
import Breadcrumbs from "../../components/Breadcrumbs";
import { SearchIcon } from "../../components/MultiSelectView";
import DefinitionListView from "../../components/DefinitionListView";
import WEEK_DAYS from "../../helpers/weekDays";

import ContractRequestQuery from "../../graphql/ContractRequestQuery.graphql";
import EmployeesQuery from "../../graphql/EmployeesQuery.graphql";
import AssignContractRequestMutation from "../../graphql/AssignContractRequestMutation.graphql";

const Details = ({ id }) => (
  <Query query={ContractRequestQuery} variables={{ id }}>
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
      } = data.contractRequest;

      const { party = "" } = assignee ? assignee : {};

      return (
        <>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/contract-requests">
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
                        to={`/contract-requests/${previousRequest.id}`}
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
            <Tabs.NavItem to="./legal-entity">Медзаклад</Tabs.NavItem>
            <Tabs.NavItem to="./divisions">Відділення</Tabs.NavItem>
            <Tabs.NavItem to="./employees">Лікарі</Tabs.NavItem>
            <Tabs.NavItem to="./external-contractors">Підрядники</Tabs.NavItem>
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
        </>
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
  ...dates
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        nhsSignerName: "Ім'я підписанта",
        nhsSignerBase: "Підстава",
        nhsContractPrice: "Ціна договору",
        nhsPaymentMethod: "Спосіб оплати",
        issueCity: "Місто укладення договору"
      }}
      data={{
        nhsSignerName: nhsSigner ? getFullName(nhsSigner.party) : null,
        nhsSignerBase,
        nhsContractPrice,
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
        ...dates
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        contractorRmspAmount: "Кількість осіб, що обслуговуються медзакладом"
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
        statusReason: "Коментар до статусу"
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
        legalEntityId: "ID медзакладу"
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

const Divisions = ({ contractorDivisions }) =>
  contractorDivisions &&
  contractorDivisions.length > 0 && (
    <Table
      data={contractorDivisions}
      header={{
        name: "Назва відділення",
        addresses: "Адреса",
        mountainGroup: "Гірський регіон",
        workingHours: "Графік роботи",
        phones: (
          <>
            Телефон <br />
            Email
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
            {mountainGroup ? (
              <PositiveIcon />
            ) : (
              <CircleIcon stroke="#1bb934" strokeWidth="4" />
            )}
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
      tableName="/contract-requests/divisions"
      hiddenFields="workingHours"
    />
  );

const Employees = ({ contractorEmployeeDivisions }) =>
  contractorEmployeeDivisions &&
  contractorEmployeeDivisions.length > 0 && (
    <Table
      data={contractorEmployeeDivisions}
      header={{
        databaseId: "ID",
        divisionName: "Назва відділення",
        employeeName: "ПІБ працівника",
        speciality: "Спеціальність",
        staffUnits: "Штатна одиниця",
        declarationLimit: "Ліміт кількості декларацій"
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
        speciality: specialities.find(item => item.specialityOfficio && item)
          .speciality,
        ...contractorEmployeeDivisions
      })}
      tableName="/contract-requests/employees"
      whiteSpaceNoWrap={["databaseId"]}
    />
  );

const ExternalContractors = ({ externalContractors }) =>
  externalContractors &&
  externalContractors.length > 0 && (
    <ExternalContractorsTable data={externalContractors} />
  );

const Documents = ({ attachedDocuments }) =>
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

const ExternalContractorsTable = ({ data }) => (
  <Table
    data={data}
    header={{
      name: "Медзаклад",
      divisions: "Відділення та послуги",
      number: "Номер договору",
      issuedAt: "Дата укладення",
      expiresAt: "Дата закінчення"
    }}
    tableName="/contract-requests/external-contractors"
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
              Показати відділення ({divisions.length})
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
                          colspan={
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
                            }) => ({ name, medicalService })}
                            tableName="/contract-requests/ExternalContractorsTable"
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
        employeeType: "NHS",
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
                  query: ContractRequestQuery,
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

const Grey = system({
  color: "blueberrySoda"
});

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

export default Details;
