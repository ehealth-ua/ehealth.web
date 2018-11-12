import React from "react";
import { Router } from "@reach/router";
import { Mutation, Query } from "react-apollo";
import { Flex, Box, Text, Heading } from "rebass/emotion";
import system from "system-components/emotion";
import printIframe from "print-iframe";
import { BooleanValue } from "react-values";

import { Form, LocationParams, Modal } from "@ehealth/components";
import {
  PrinterIcon,
  PositiveIcon,
  DefaultImageIcon,
  CircleIcon,
  AdminSearchIcon
} from "@ehealth/icons";
import {
  getFullName,
  filterTableColumn as filterTableDefaultColumn,
  parseSortingParams,
  stringifySortingParams
} from "@ehealth/utils";

import Line from "../../components/Line";
import Tabs from "../../components/Tabs";
import Table, {
  TableBodyComponent,
  TableRow,
  TableCell
} from "../../components/Table";
import Link from "../../components/Link";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import AddressView from "../../components/AddressView";
import Breadcrumbs from "../../components/Breadcrumbs";
import DefinitionListView from "../../components/DefinitionListView";

import ContractQuery from "../../graphql/ContractQuery.graphql";
import TerminateContractMutation from "../../graphql/TerminateContractMutation.graphql";
import { ITEMS_PER_PAGE } from "../../constants/pagination";
import Pagination from "../../components/Pagination";

const Details = ({ id }) => (
  <Query query={ContractQuery} variables={{ id, first: ITEMS_PER_PAGE[0] }}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      const {
        isSuspended,
        databaseId,
        contractNumber,
        contractRequest: {
          id: contractRequestId,
          databaseId: contractRequestDatabaseId
        },
        status,
        printoutContent: content,
        startDate,
        endDate,
        nhsSignerId,
        nhsSigner: { party: nhsSignerName },
        nhsSignerBase,
        nhsContractPrice,
        nhsPaymentMethod,
        issueCity,
        contractorRmspAmount,
        contractorLegalEntity,
        contractorOwner,
        contractorBase,
        contractorPaymentDetails,
        externalContractors,
        attachedDocuments
      } = data.contract;

      return (
        <>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/contracts">
                  Перелік договорів
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>Деталі договору</Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Flex justifyContent="space-between">
              <Box>
                <DefinitionListView
                  labels={{
                    databaseId: "ID договору",
                    contractRequestId: "ID заяви",
                    contractNumber: "Номер договору",
                    status: "Статус",
                    isSuspended: "Призупинений"
                  }}
                  data={{
                    databaseId,
                    contractRequestId: (
                      <Link to={`/contract-requests/${contractRequestId}`}>
                        {contractRequestDatabaseId}
                      </Link>
                    ),
                    contractNumber,
                    status: (
                      <Badge name={status} type="CONTRACT" minWidth={100} />
                    ),
                    isSuspended: isSuspended ? (
                      <PositiveIcon />
                    ) : (
                      <CircleIcon stroke="#1bb934" strokeWidth="4" />
                    )
                  }}
                  color="#7F8FA4"
                  labelWidth="120px"
                />
              </Box>
              <Flex
                flexDirection="column"
                justifyContent="space-between"
                alignItems="flex-end"
              >
                {content && <PrintButton content={content} />}
                {status === "VERIFIED" && (
                  <Popup
                    variant="red"
                    buttonText="Розірвати договір"
                    title="Розірвати договір"
                  >
                    {toggle => (
                      <Mutation
                        mutation={TerminateContractMutation}
                        refetchQueries={() => [
                          {
                            query: ContractQuery,
                            variables: { id, first: ITEMS_PER_PAGE[0] }
                          }
                        ]}
                      >
                        {terminateContract => (
                          <Form
                            onSubmit={async ({ statusReason }) => {
                              await terminateContract({
                                variables: { input: { id, statusReason } }
                              });
                              toggle();
                            }}
                          >
                            <Text mb={2}>
                              Увага! Після розірвання договору, цю дію не можна
                              буде скасувати
                            </Text>
                            <Field.Textarea
                              name="statusReason"
                              placeholder="Вкажіть причину розірвання договору"
                              rows={5}
                            />
                            <Flex justifyContent="center">
                              <Box mr={20}>
                                <Button variant="blue" onClick={toggle}>
                                  Повернутися
                                </Button>
                              </Box>
                              <Button type="submit" variant="red">
                                Розірвати договір
                              </Button>
                            </Flex>
                          </Form>
                        )}
                      </Mutation>
                    )}
                  </Popup>
                )}
              </Flex>
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
                contractorRmspAmount={contractorRmspAmount}
                nhsSignerId={nhsSignerId}
                nhsSignerName={nhsSignerName}
                nhsSignerBase={nhsSignerBase}
                nhsContractPrice={nhsContractPrice}
                nhsPaymentMethod={nhsPaymentMethod}
                issueCity={issueCity}
              />
              <LegalEntity
                path="/legal-entity"
                contractorOwner={contractorOwner}
                contractorBase={contractorBase}
                contractorLegalEntity={contractorLegalEntity}
                contractorPaymentDetails={contractorPaymentDetails}
              />
              <Divisions path="/divisions" />
              <Employees path="/employees" />
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
  contractorRmspAmount,
  nhsSignerId,
  nhsSignerName,
  nhsSignerBase,
  nhsContractPrice,
  nhsPaymentMethod,
  issueCity,
  ...dates
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        nhsSignerId: "ID підписанта",
        nhsSignerName: "Ім'я підписанта",
        nhsSignerBase: "Підстава",
        nhsContractPrice: "Ціна договору",
        nhsPaymentMethod: "Спосіб оплати",
        issueCity: "Місто укладення договору"
      }}
      data={{
        nhsSignerId,
        nhsSignerName: getFullName(nhsSignerName),
        nhsSignerBase,
        nhsContractPrice,
        nhsPaymentMethod,
        issueCity
      }}
    />
    <Line />
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
  </Box>
);

const LegalEntity = ({
  contractorBase,
  contractorOwner,
  contractorPaymentDetails: { bankName, mfo, payerAccount },
  contractorLegalEntity: { databaseId: legalEntityId, name, edrpou, addresses }
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
        legalEntityId
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

const Divisions = ({ id }) => (
  <LocationParams>
    {({ locationParams, setLocationParams }) => {
      const { first, last, after, before, name } = locationParams;
      return (
        <>
          <Form onSubmit={setLocationParams} initialValues={locationParams}>
            <Box px={5} pt={5} width={460}>
              <Field.Text
                name="name"
                label="Знайти відділення"
                placeholder="Введіть назву відділення"
                postfix={<AdminSearchIcon color="#CED0DA" />}
              />
            </Box>
          </Form>
          <Query
            query={ContractQuery}
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
              divisionFilter: { name }
            }}
          >
            {({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error) return `Error! ${error.message}`;
              const {
                contractorDivisions: {
                  nodes: contractorDivisions,
                  pageInfo
                } = {}
              } = data.contract;
              return contractorDivisions && contractorDivisions.length ? (
                <>
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
                      action: "Дія"
                    }}
                    renderRow={({
                      databaseId,
                      name,
                      addresses,
                      mountainGroup,
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
                              .map(item => item.number)[0] || phones[0].number}
                          </Box>
                          <Box>{email}</Box>
                        </>
                      ),
                      addresses: addresses
                        .filter(a => a.type === "RESIDENCE")
                        .map((item, key) => (
                          <AddressView data={item} key={key} />
                        )),
                      action: (
                        <Link
                          to={`../employees?division.databaseId=${databaseId}&division.name=${name}`}
                          fontWeight="bold"
                        >
                          Перейти до працівників
                        </Link>
                      )
                    })}
                    tableName="/contract/divisions"
                  />
                  <Pagination {...pageInfo} />
                </>
              ) : null;
            }}
          </Query>
        </>
      );
    }}
  </LocationParams>
);

const Employees = ({ id }) => (
  <LocationParams>
    {({ locationParams, setLocationParams }) => {
      const { first, last, after, before, orderBy, division } = locationParams;
      return (
        <>
          <Form onSubmit={setLocationParams} initialValues={locationParams}>
            <Box px={5} pt={5} width={460}>
              <Field.Text
                name="division.name"
                label="Знайти за відділенням"
                placeholder="Введіть назву відділення"
                postfix={<AdminSearchIcon color="#CED0DA" />}
              />
            </Box>
          </Form>
          <Query
            query={ContractQuery}
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
              employeeFilter: { division }
            }}
          >
            {({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error) return `Error! ${error.message}`;
              const {
                contractorEmployeeDivisions: {
                  nodes: contractorEmployeeDivisions,
                  pageInfo
                } = {}
              } = data.contract;
              return (
                contractorEmployeeDivisions &&
                contractorEmployeeDivisions.length > 0 && (
                  <>
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
                        speciality: specialities.find(
                          item => item.specialityOfficio && item
                        ).speciality,
                        ...contractorEmployeeDivisions
                      })}
                      sortableFields={["staffUnits", "declarationLimit"]}
                      sortingParams={parseSortingParams(locationParams.orderBy)}
                      onSortingChange={sortingParams =>
                        setLocationParams({
                          ...locationParams,
                          orderBy: stringifySortingParams(sortingParams)
                        })
                      }
                      tableName="/contract/employees"
                      whiteSpaceNoWrap={["databaseId"]}
                    />
                    <Pagination {...pageInfo} />
                  </>
                )
              );
            }}
          </Query>
        </>
      );
    }}
  </LocationParams>
);

const ExternalContractors = ({ externalContractors }) =>
  externalContractors &&
  externalContractors.length > 0 && (
    <ExternalContractorsTable data={externalContractors} />
  );

const Documents = ({ attachedDocuments }) =>
  attachedDocuments &&
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
    tableName="/contract/external-contractors"
    tableBody={({
      columns,
      data,
      rowKeyExtractor,
      columnKeyExtractor,
      filterTableColumn = filterTableDefaultColumn,
      filterRow
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
                            tableName="/contract/ExternalContractorsTable"
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
