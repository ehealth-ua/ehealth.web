import React from "react";
import { Router } from "@reach/router";
import { Mutation, Query } from "react-apollo";
import { Flex, Box, Text, Heading } from "rebass/emotion";
import system from "system-components/emotion";
import printIframe from "print-iframe";
import { BooleanValue } from "react-values";
import { loader } from "graphql.macro";
import { Trans } from "@lingui/macro";

import { Form, Validation, LocationParams, Modal } from "@ehealth/components";
import {
  PrinterIcon,
  PositiveIcon,
  DefaultImageIcon,
  AdminSearchIcon,
  CancelIcon,
  NegativeIcon
} from "@ehealth/icons";
import {
  getFullName,
  filterTableColumn as filterTableDefaultColumn,
  parseSortingParams,
  stringifySortingParams
} from "@ehealth/utils";

import Line from "../../../components/Line";
import Tabs from "../../../components/Tabs";
import Table, {
  TableBodyComponent,
  TableRow,
  TableCell
} from "../../../components/Table";
import Link from "../../../components/Link";
import Badge from "../../../components/Badge";
import LoadingOverlay from "../../../components/LoadingOverlay";
import Button from "../../../components/Button";
import Tooltip from "../../../components/Tooltip";
import * as Field from "../../../components/Field";
import AddressView from "../../../components/AddressView";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DictionaryValue from "../../../components/DictionaryValue";
import DefinitionListView from "../../../components/DefinitionListView";
import { ITEMS_PER_PAGE } from "../../../constants/pagination";
import Pagination from "../../../components/Pagination";

const CapitationContractQuery = loader(
  "../../../graphql/CapitationContractQuery.graphql"
);
const TerminateContractMutation = loader(
  "../../../graphql/TerminateContractMutation.graphql"
);
const ProlongateContractMutation = loader(
  "../../../graphql/ProlongateContractMutation.graphql"
);

const CapitationContractsDetails = () => (
  <Router>
    <Details path=":id/*" />
  </Router>
);

const Details = ({ id }) => (
  <Query
    query={CapitationContractQuery}
    variables={{ id, first: ITEMS_PER_PAGE[0] }}
  >
    {({ loading, error, data: { capitationContract = {} } = {} }) => {
      if (error) return `Error! ${error.message}`;
      const {
        isSuspended,
        databaseId,
        contractNumber,
        contractRequest: {
          id: contractRequestId,
          databaseId: contractRequestDatabaseId,
          printoutContent: contractRequestContent
        } = {},
        status,
        startDate,
        endDate,
        nhsSignerId,
        nhsSigner: { party: nhsSignerName = "" } = {},
        nhsSignerBase,
        nhsContractPrice,
        nhsPaymentMethod,
        issueCity,
        contractorRmspAmount,
        contractorLegalEntity = {},
        contractorOwner,
        contractorBase,
        contractorPaymentDetails,
        externalContractors = [],
        attachedDocuments,
        statusReason
      } = capitationContract;

      return (
        <LoadingOverlay loading={loading}>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/contracts">
                  <Trans>Перелік договорів</Trans>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Trans>Деталі договору</Trans>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Flex justifyContent="space-between">
              <Box>
                <DefinitionListView
                  labels={{
                    databaseId: <Trans>ID договору</Trans>,
                    contractRequestId: <Trans>ID заяви</Trans>,
                    contractNumber: <Trans>Номер договору</Trans>,
                    status: <Trans>Статус</Trans>,
                    isSuspended: <Trans>Призупинений</Trans>
                  }}
                  data={{
                    databaseId,
                    contractRequestId: (
                      <Link
                        to={`/contract-requests/capitation/${contractRequestId}`}
                      >
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
                      <NegativeIcon />
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
                <PrintButton content={contractRequestContent} />
                {status === "VERIFIED" && (
                  <Popup
                    variant="red"
                    buttonText={<Trans>Розірвати договір</Trans>}
                    title={<Trans>Розірвати договір</Trans>}
                  >
                    {toggle => (
                      <Mutation
                        mutation={TerminateContractMutation}
                        refetchQueries={() => [
                          {
                            query: CapitationContractQuery,
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
                              <Trans>
                                Увага! Після розірвання договору, цю дію не
                                можна буде скасувати
                              </Trans>
                            </Text>
                            <Trans
                              id="Вкажіть причину розірвання договору"
                              render={({ translate }) => (
                                <Field.Textarea
                                  name="statusReason"
                                  placeholder={translate}
                                  rows={5}
                                  maxlength="3000"
                                />
                              )}
                            />
                            <Flex justifyContent="center">
                              <Box mr={20}>
                                <Button variant="blue" onClick={toggle}>
                                  <Trans>Повернутися</Trans>
                                </Button>
                              </Box>
                              <Button type="submit" variant="red">
                                <Trans>Розірвати договір</Trans>
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
            <Tabs.NavItem to="./">
              <Trans>Загальна інформація</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./legal-entity">
              <Trans>Медзаклад</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./divisions">
              <Trans>Відділення</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./employees">
              <Trans>Лікарі</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./external-contractors">
              <Trans>Підрядники</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./documents">
              <Trans>Документи</Trans>
            </Tabs.NavItem>
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
                statusReason={statusReason}
                contractorLegalEntity={contractorLegalEntity}
                status={status}
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
        </LoadingOverlay>
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
  startDate,
  endDate,
  id,
  statusReason,
  contractorLegalEntity,
  status
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        nhsSignerId: <Trans>ID підписанта</Trans>,
        nhsSignerName: <Trans>Ім'я підписанта</Trans>,
        nhsSignerBase: <Trans>Підстава</Trans>,
        nhsContractPrice: <Trans>Ціна договору</Trans>,
        nhsPaymentMethod: <Trans>Спосіб оплати</Trans>,
        issueCity: <Trans>Місто укладення договору</Trans>
      }}
      data={{
        nhsSignerId,
        nhsSignerName: getFullName(nhsSignerName),
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
    <Line />
    <DefinitionListView
      labels={{
        startDate: <Trans>Початкова дата дії контракту</Trans>,
        endDate: <Trans>Кінцева дата дії контракту</Trans>
      }}
      data={{
        startDate,
        endDate: checkStatusProlongate(
          contractorLegalEntity,
          contractorLegalEntity.id,
          status
        ) ? (
          <ProlongateContract id={id} endDate={endDate} />
        ) : (
          endDate
        )
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        contractorRmspAmount: (
          <Trans>Кількість осіб, що обслуговуються медзакладом</Trans>
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
        statusReason: <Trans>Коментар до статусу</Trans>
      }}
      data={{
        statusReason
      }}
    />
  </Box>
);

const checkStatusProlongate = (data, id, statusContract) => {
  if (statusContract === "TERMINATED") {
    return false;
  }
  if (
    data.mergedToLegalEntity &&
    data.mergedToLegalEntity.mergedFromLegalEntity
  ) {
    const {
      id: mergedFromLegalEntityId
    } = data.mergedToLegalEntity.mergedFromLegalEntity;
    return mergedFromLegalEntityId === id;
  }
  return false;
};

const ProlongateContract = ({ endDate, id }) => (
  <BooleanValue>
    {({ value: opened, toggle }) =>
      opened ? (
        <Mutation
          mutation={ProlongateContractMutation}
          refetchQueries={() => [
            {
              query: CapitationContractQuery,
              variables: { id, first: ITEMS_PER_PAGE[0] }
            }
          ]}
        >
          {prolongateContract => (
            <Form
              onSubmit={async ({ endDate }) => {
                await prolongateContract({
                  variables: { input: { id, endDate } }
                });
                toggle();
              }}
              initialValues={{ endDate }}
            >
              <Flex>
                <Field.DatePicker
                  name="endDate"
                  placement="top"
                  minDate={endDate}
                />
                <Validation.Required
                  field="endDate"
                  message={<Trans>Обовʼязкове поле</Trans>}
                />
                <Box mx={2} color="redPigment">
                  <Button
                    variant="none"
                    border="none"
                    px="0"
                    type="reset"
                    onClick={toggle}
                  >
                    <CancelIcon />
                  </Button>
                </Box>
                <Box>
                  <Tooltip
                    component={() => (
                      <Button variant="none" border="none" px="0">
                        <PositiveIcon />
                      </Button>
                    )}
                    content={
                      <Trans>
                        Увага! Ви збираєтесь змінити кінцеву дату контракту.
                        <br />
                        Натискаючи кнопку “Зберегти зміни”, ви
                        <br />
                        підтверджуєте справжність вашого наміру
                      </Trans>
                    }
                  />
                </Box>
              </Flex>
            </Form>
          )}
        </Mutation>
      ) : (
        <Flex>
          {endDate}
          <Button variant="none" border="none" px="0" py="0" onClick={toggle}>
            <Text color="rockmanBlue" fontWeight="bold" ml={2}>
              <Trans>змінити</Trans>
            </Text>
          </Button>
        </Flex>
      )
    }
  </BooleanValue>
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
        edrpou: <Trans>ЄДРПОУ</Trans>,
        name: <Trans>Назва</Trans>,
        addresses: <Trans>Адреса</Trans>
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
        legalEntityId: <Trans>ID медзакладу</Trans>
      }}
      data={{
        legalEntityId: (
          <Link to={`/legal-entities/${legalEntityId}`}>
            {legalEntityDatabaseId}
          </Link>
        )
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        fullName: <Trans>ПІБ підписанта</Trans>,
        contractorBase: <Trans>Діє на основі</Trans>
      }}
      data={{
        fullName: contractorOwner && getFullName(contractorOwner.party),
        contractorBase: contractorBase
      }}
    />
    <DefinitionListView
      color="blueberrySoda"
      labels={{
        ownerId: <Trans>ID підписанта</Trans>
      }}
      data={{
        ownerId: contractorOwner && contractorOwner.databaseId
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        bankName: <Trans>Банк</Trans>,
        mfo: <Trans>Код банку (МФО)</Trans>,
        payerAccount: <Trans>Номер рахунку</Trans>
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
              <Trans
                id="Введіть назву відділення"
                render={({ translate }) => (
                  <Field.Text
                    name="name"
                    label={<Trans>Знайти відділення</Trans>}
                    placeholder={translate}
                    postfix={<AdminSearchIcon color="#CED0DA" />}
                  />
                )}
              />
            </Box>
          </Form>
          <Query
            query={CapitationContractQuery}
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
            {({
              loading,
              error,
              data: {
                capitationContract: {
                  contractorDivisions: {
                    nodes: contractorDivisions = [],
                    pageInfo
                  } = {}
                } = {}
              } = {}
            }) => {
              if (error) return `Error! ${error.message}`;
              return (
                <LoadingOverlay loading={loading}>
                  {contractorDivisions.length > 0 ? (
                    <>
                      <Table
                        data={contractorDivisions}
                        header={{
                          name: <Trans>Назва відділення</Trans>,
                          addresses: <Trans>Адреса</Trans>,
                          mountainGroup: <Trans>Гірський регіон</Trans>,
                          phones: (
                            <>
                              <Trans>Телефон</Trans>
                              <br />
                              <Trans>Email</Trans>
                            </>
                          ),
                          action: <Trans>Дія</Trans>
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
                                <NegativeIcon />
                              )}
                            </Flex>
                          ),
                          phones: (
                            <>
                              <Box>
                                {phones
                                  .filter(a => a.type === "MOBILE")
                                  .map(item => item.number)[0] ||
                                  phones[0].number}
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
                              <Trans>Перейти до працівників</Trans>
                            </Link>
                          )
                        })}
                        tableName="/contract/divisions"
                      />
                      <Pagination {...pageInfo} />
                    </>
                  ) : (
                    <EmptyData />
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

const Employees = ({ id }) => (
  <LocationParams>
    {({ locationParams, setLocationParams }) => {
      const { first, last, after, before, orderBy, division } = locationParams;
      return (
        <>
          <Form onSubmit={setLocationParams} initialValues={locationParams}>
            <Box px={5} pt={5} width={460}>
              <Trans
                id="Введіть назву відділення"
                render={({ translate }) => (
                  <Field.Text
                    name="division.name"
                    label={<Trans>Знайти за відділенням</Trans>}
                    placeholder={translate}
                    postfix={<AdminSearchIcon color="#CED0DA" />}
                  />
                )}
              />
            </Box>
          </Form>
          <Query
            query={CapitationContractQuery}
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
            {({
              loading,
              error,
              data: {
                capitationContract: {
                  contractorEmployeeDivisions: {
                    nodes: contractorEmployeeDivisions = [],
                    pageInfo
                  } = {}
                } = {}
              } = {}
            }) => {
              if (error) return `Error! ${error.message}`;
              return (
                <LoadingOverlay loading={loading}>
                  {contractorEmployeeDivisions.length > 0 ? (
                    <>
                      <Table
                        data={contractorEmployeeDivisions}
                        header={{
                          databaseId: <Trans>ID</Trans>,
                          divisionName: <Trans>Назва відділення</Trans>,
                          employeeName: <Trans>ПІБ працівника</Trans>,
                          speciality: <Trans>Спеціальність</Trans>,
                          staffUnits: <Trans>Штатна одиниця</Trans>,
                          declarationLimit: (
                            <Trans>Ліміт кількості декларацій</Trans>
                          )
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
                                specialities.find(
                                  item => item.specialityOfficio && item
                                ).speciality
                              }
                            />
                          ),
                          ...contractorEmployeeDivisions
                        })}
                        sortableFields={["staffUnits", "declarationLimit"]}
                        sortingParams={parseSortingParams(
                          locationParams.orderBy
                        )}
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
                  ) : (
                    <EmptyData />
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

const ExternalContractors = ({ externalContractors }) =>
  externalContractors && externalContractors.length > 0 ? (
    <ExternalContractorsTable data={externalContractors} />
  ) : (
    <EmptyData />
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
      name: <Trans>Медзаклад</Trans>,
      divisions: <Trans>Відділення та послуги</Trans>,
      number: <Trans>Номер договору</Trans>,
      issuedAt: <Trans>Дата укладення</Trans>,
      expiresAt: <Trans>Дата закінчення</Trans>
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
              <Trans>Показати відділення</Trans>({divisions.length})
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
                            }) => ({
                              name,
                              medicalService: (
                                <DictionaryValue
                                  name="MEDICAL_SERVICE"
                                  item={medicalService}
                                />
                              )
                            })}
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
      <Trans>Дивитись друковану форму</Trans>
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

const EmptyData = props => (
  <Text color="shiningKnight" {...props} fontSize={1} mx={6} my={2}>
    <Trans>Інформація відсутня</Trans>
  </Text>
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

export default CapitationContractsDetails;
