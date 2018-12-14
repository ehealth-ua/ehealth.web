import React from "react";
import { Router } from "@reach/router";
import { Mutation, Query } from "react-apollo";
import { Flex, Box, Text, Heading } from "rebass/emotion";
import system from "system-components/emotion";
import format from "date-fns/format";
import printIframe from "print-iframe";
import { BooleanValue } from "react-values";
import { loader } from "graphql.macro";
import { Trans } from "@lingui/macro";
import isEmpty from "lodash/isEmpty";

import { Form, Validation, LocationParams, Modal } from "@ehealth/components";
import {
  PrinterIcon,
  PositiveIcon,
  DefaultImageIcon,
  AdminSearchIcon,
  CancelIcon,
  NegativeIcon
} from "@ehealth/icons";
import { getFullName } from "@ehealth/utils";

import Line from "../../../components/Line";
import Tabs from "../../../components/Tabs";
import Table from "../../../components/Table";
import Link from "../../../components/Link";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import Tooltip from "../../../components/Tooltip";
import * as Field from "../../../components/Field";
import AddressView from "../../../components/AddressView";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DefinitionListView from "../../../components/DefinitionListView";
import Pagination from "../../../components/Pagination";
import { ITEMS_PER_PAGE } from "../../../constants/pagination";

const ReimbursementContractQuery = loader(
  "../../../graphql/ReimbursementContractQuery.graphql"
);
const TerminateContractMutation = loader(
  "../../../graphql/TerminateContractMutation.graphql"
);
const ProlongateContractMutation = loader(
  "../../../graphql/ProlongateContractMutation.graphql"
);

const ReimbursementContractsDetails = () => (
  <Router>
    <Details path=":id/*" />
  </Router>
);

const Details = ({ id }) => (
  <Query
    query={ReimbursementContractQuery}
    variables={{ id, first: ITEMS_PER_PAGE[0] }}
  >
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      const {
        isSuspended,
        databaseId,
        contractNumber,
        contractRequest: {
          id: contractRequestId,
          databaseId: contractRequestDatabaseId,
          printoutContent: contractRequestContent
        },
        status,
        startDate,
        endDate,
        statusReason,
        contractorLegalEntity,
        contractorOwner,
        contractorBase,
        contractorPaymentDetails,
        attachedDocuments,
        medicalProgram
      } = data.reimbursementContract;

      return (
        <>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/contracts/reimbursement">
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
                    databaseId: "ID договору",
                    contractRequestId: "ID заяви",
                    contractNumber: <Trans>Номер договору</Trans>,
                    status: <Trans>Статус</Trans>,
                    isSuspended: <Trans>Призупинений</Trans>
                  }}
                  data={{
                    databaseId,
                    contractRequestId: (
                      <Link
                        to={`/contract-requests/reimbursement/${contractRequestId}`}
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
                            query: ReimbursementContractQuery,
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
              <Trans>Аптека</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./divisions">
              <Trans>Відділення</Trans>
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
                statusReason={statusReason}
                contractorLegalEntity={contractorLegalEntity}
                medicalProgram={medicalProgram}
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
  startDate,
  endDate,
  id,
  statusReason,
  contractorLegalEntity,
  medicalProgram,
  status
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        startDate: <Trans>Початкова дата дії договору</Trans>,
        endDate: <Trans>Кінцева дата дії договору</Trans>
      }}
      data={{
        startDate: format(startDate, "DD.MM.YYYY"),
        endDate: checkStatusProlongate(
          contractorLegalEntity,
          contractorLegalEntity.id,
          status
        ) ? (
          <ProlongateContract id={id} endDate={endDate} />
        ) : (
          format(endDate, "DD.MM.YYYY")
        )
      }}
    />
    {!isEmpty(medicalProgram) && (
      <>
        <Line />
        <DefinitionListView
          labels={{
            medicalProgram: <Trans>Медична програма</Trans>
          }}
          data={{
            medicalProgram: medicalProgram.name
          }}
        />
      </>
    )}
    {!isEmpty(statusReason) && (
      <>
        <Line />
        <DefinitionListView
          labels={{
            statusReason: <Trans>Коментар до статусу</Trans>
          }}
          data={{
            statusReason
          }}
        />
      </>
    )}
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
              query: ReimbursementContractQuery,
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
                  minDate={endDate}
                  placement="top"
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
                      <>
                        <Trans>
                          Увага! Ви збираєтесь змінити кінцеву дату контракту.
                        </Trans>
                        <br />
                        <Trans>Натискаючи кнопку “Зберегти зміни”, ви</Trans>
                        <br />
                        підтверджуєте справжність вашого наміру
                      </>
                    }
                  />
                </Box>
              </Flex>
            </Form>
          )}
        </Mutation>
      ) : (
        <Flex>
          {format(endDate, "DD.MM.YYYY")}
          <Button variant="none" border="none" px="0" py="0" onClick={toggle}>
            <Text color="rockmanBlue" fontWeight="bold" ml={2}>
              змінити
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
        legalEntityId: "ID аптеки"
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
        ownerId: "ID підписанта"
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
            query={ReimbursementContractQuery}
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
              } = data.reimbursementContract;
              if (isEmpty(contractorDivisions)) return null;

              return (
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
                          Email
                        </>
                      )
                    }}
                    renderRow={({
                      name,
                      addresses,
                      mountainGroup,
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
                              .map(item => item.number)[0] || phones[0].number}
                          </Box>
                          <Box>{email}</Box>
                        </>
                      ),
                      addresses: addresses
                        .filter(a => a.type === "RESIDENCE")
                        .map((item, key) => (
                          <AddressView data={item} key={key} />
                        ))
                    })}
                    tableName="reimbursement-contract/divisions"
                  />
                  <Pagination {...pageInfo} />
                </>
              );
            }}
          </Query>
        </>
      );
    }}
  </LocationParams>
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

export default ReimbursementContractsDetails;
