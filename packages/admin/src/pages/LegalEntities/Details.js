import React from "react";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { BooleanValue } from "react-values";
import { Flex, Box, Heading } from "rebass/emotion";
import system from "system-components/emotion";
import format from "date-fns/format";
import { loader } from "graphql.macro";
import isEmpty from "lodash/isEmpty";

import {
  PositiveIcon,
  AdminSearchIcon,
  AdminAddIcon,
  NegativeIcon,
  CommentIcon
} from "@ehealth/icons";
import {
  getFullName,
  getPhones,
  parseSortingParams,
  stringifySortingParams
} from "@ehealth/utils";
import { LocationParams, Form, Modal, Switch } from "@ehealth/components";

import Line from "../../components/Line";
import Link from "../../components/Link";
import Tabs from "../../components/Tabs";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import Button, { IconButton } from "../../components/Button";
import Tooltip from "../../components/Tooltip";
import Ability from "../../components/Ability";
import * as Field from "../../components/Field";
import AddressView from "../../components/AddressView";
import Breadcrumbs from "../../components/Breadcrumbs";
import DefinitionListView from "../../components/DefinitionListView";

import STATUSES from "../../helpers/statuses";

const DeactivateLegalEntityMutation = loader(
  "../../graphql/DeactivateLegalEntityMutation.graphql"
);
const NhsVerifyLegalEntityMutation = loader(
  "../../graphql/NhsVerifyLegalEntityMutation.graphql"
);
const NhsCommentLegalEntityMutation = loader(
  "../../graphql/NhsCommentLegalEntityMutation.graphql"
);
const NhsReviewLegalEntityMutation = loader(
  "../../graphql/NhsReviewLegalEntityMutation.graphql"
);
const LegalEntityQuery = loader("../../graphql/LegalEntityQuery.graphql");

const Details = ({ id }) => (
  <Query query={LegalEntityQuery} variables={{ id, first: 10 }}>
    {({ loading, error, data: { legalEntity } }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      const {
        id,
        databaseId,
        status,
        edrpou,
        name,
        addresses,
        phones,
        email,
        type,
        ownerPropertyType,
        kveds,
        misVerified,
        nhsVerified,
        nhsReviewed,
        nhsComment,
        owner,
        medicalServiceProvider,
        mergedToLegalEntity,
        website,
        receiverFundsCode,
        legalForm,
        beneficiary,
        archive
      } = legalEntity;
      const isVerificationActive = status === "ACTIVE" && nhsReviewed;

      return (
        <>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/legal-entities">
                  Пошук медзакладу
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>Деталі медзакладу</Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Flex justifyContent="space-between" alignItems="flex-end">
              <Box>
                <DefinitionListView
                  labels={{ databaseId: "ID медзакладу", status: "Статус" }}
                  data={{
                    databaseId,
                    status: (
                      <Badge name={status} type="LEGALENTITY" minWidth={100} />
                    )
                  }}
                  color="#7F8FA4"
                  labelWidth="100px"
                />
              </Box>
              {status === "ACTIVE" && (
                <>
                  {!nhsReviewed ? (
                    <Mutation
                      mutation={NhsReviewLegalEntityMutation}
                      refetchQueries={() => [
                        {
                          query: LegalEntityQuery,
                          variables: { id, first: 10 }
                        }
                      ]}
                    >
                      {nhsReviewLegalEntity => (
                        <Button
                          onClick={async () => {
                            await nhsReviewLegalEntity({
                              variables: {
                                input: {
                                  id,
                                  nhsReviewed: true
                                }
                              }
                            });
                          }}
                          variant="blue"
                        >
                          Взяти в роботу
                        </Button>
                      )}
                    </Mutation>
                  ) : (
                    <Box mr={20}>
                      <Popup
                        variant="red"
                        buttonText="Закрити медзаклад"
                        title="Закрити медзаклад"
                      >
                        {toggle => (
                          <Mutation
                            mutation={DeactivateLegalEntityMutation}
                            refetchQueries={() => [
                              {
                                query: LegalEntityQuery,
                                variables: { id, first: 10 }
                              }
                            ]}
                          >
                            {deactivateLegalEntity => (
                              <Flex justifyContent="center">
                                <Box mr={20}>
                                  <Button variant="blue" onClick={toggle}>
                                    Повернутися
                                  </Button>
                                </Box>
                                <Button
                                  onClick={async () => {
                                    await deactivateLegalEntity({
                                      variables: {
                                        input: { id }
                                      }
                                    });
                                    toggle();
                                  }}
                                  variant="red"
                                >
                                  Закрити медзаклад
                                </Button>
                              </Flex>
                            )}
                          </Mutation>
                        )}
                      </Popup>
                    </Box>
                  )}
                </>
              )}
            </Flex>
          </Box>

          <Tabs.Nav>
            <Tabs.NavItem to="./">Загальна інформація</Tabs.NavItem>
            <Tabs.NavItem to="./licenses">Ліцензії / Верифікація</Tabs.NavItem>
            <Ability action="read" resource="related_legal_entities">
              <Tabs.NavItem to="./related-legal-entities">
                Підпорядковані медзаклади
              </Tabs.NavItem>
            </Ability>
            {owner && <Tabs.NavItem to="./owner">Власник</Tabs.NavItem>}
            <Ability action="read" resource="division">
              <Tabs.NavItem to="./divisions">Відділення</Tabs.NavItem>
            </Ability>
            {/*<Tabs.NavItem to="./requests-for-contract">*/}
            {/*Заяви на укладення договору*/}
            {/*</Tabs.NavItem>*/}
            {/*<Tabs.NavItem to="./contracts">Договори</Tabs.NavItem>*/}
          </Tabs.Nav>
          <Tabs.Content>
            <Router>
              <GeneralInfo
                path="/"
                edrpou={edrpou}
                name={name}
                addresses={addresses}
                phones={phones}
                email={email}
                type={type}
                ownerPropertyType={ownerPropertyType}
                kveds={kveds}
                misVerified={misVerified}
                website={website}
                receiverFundsCode={receiverFundsCode}
                legalForm={legalForm}
                beneficiary={beneficiary}
                archive={archive}
              />
              <License
                path="/licenses"
                license={medicalServiceProvider}
                nhsVerified={nhsVerified}
                nhsComment={nhsComment}
                isVerificationActive={isVerificationActive}
              />
              <RelatedLegalEntities
                path="/related-legal-entities"
                status={status}
                mergedToLegalEntity={mergedToLegalEntity}
              />
              <Owner path="/owner" owner={owner} />
              <Divisions path="/divisions" />
            </Router>
          </Tabs.Content>
        </>
      );
    }}
  </Query>
);

const GeneralInfo = ({
  addresses,
  phones,
  type,
  ownerPropertyType,
  kveds,
  misVerified,
  receiverFundsCode,
  legalForm,
  beneficiary,
  archive,
  ...props
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        edrpou: "ЄДРПОУ",
        name: "Назва",
        addresses: "Адреса",
        phones: "Номер телефону",
        email: "Email",
        website: "Веб-сторінка",
        type: "Тип"
      }}
      data={{
        ...props,
        addresses: addresses
          .filter(a => a.type === "REGISTRATION")
          .map((item, key) => <AddressView data={item} key={key} />),
        phones: getPhones(phones),
        type: STATUSES.LEGAL_ENTITY_TYPE[type]
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        ownerPropertyType: "Тип власності",
        legalForm: "Форма господарювання",
        kveds: "КВЕДи",
        receiverFundsCode: "Код одержувача бюджетних коштів",
        beneficiary: "Вигодонабувач"
      }}
      data={{
        ownerPropertyType,
        legalForm,
        beneficiary,
        receiverFundsCode,
        kveds: kveds.map((el, key, arr) => (
          <React.Fragment key={key}>
            {el}
            {key !== arr.length - 1 && ", "}
          </React.Fragment>
        ))
      }}
    />
    <DefinitionListView
      labels={{
        misVerified: "Верифікація МІС"
      }}
      data={{
        misVerified: misVerified ? <PositiveIcon /> : <NegativeIcon />
      }}
      color="blueberrySoda"
    />

    {!isEmpty(archive) && (
      <>
        <Line />
        <Heading fontSize="1" fontWeight="normal" mb={5}>
          Архів
        </Heading>

        {archive.map(({ date, place }, index) => (
          <ArchiveBox key={index}>
            <DefinitionListView
              labels={{
                date: "Дата архівування",
                place: "Місце зберігання"
              }}
              data={{
                date: format(date, "DD.MM.YYYY"),
                place
              }}
            />
          </ArchiveBox>
        ))}
      </>
    )}
  </Box>
);

const License = ({
  id,
  isVerificationActive,
  license,
  nhsVerified,
  nhsComment
}) => {
  const {
    accreditation,
    accreditation: { orderDate, issuedDate, expiryDate } = {},
    licenses
  } = license || {};

  return (
    <Box p={5}>
      {!isEmpty(accreditation) && (
        <>
          <Heading fontSize="1" fontWeight="normal" mb={5}>
            Акредитація
          </Heading>
          <DefinitionListView
            labels={{
              category: "Категорія",
              validateDate: "Термін дії",
              orderDate: "Дата наказу",
              orderNo: "Номер наказу"
            }}
            data={{
              ...accreditation,
              orderDate: format(orderDate, "DD.MM.YYYY"),
              validateDate: `з ${format(issuedDate, "DD.MM.YYYY")} ${
                expiryDate ? `по ${format(expiryDate, "DD.MM.YYYY")}` : ""
              }`
            }}
          />
          <Line />
        </>
      )}
      {!isEmpty(licenses) && (
        <>
          <Heading fontSize="1" fontWeight="normal" mb={5}>
            Ліцензії
          </Heading>

          <Table
            data={licenses}
            header={{
              licenseNumber: "Номер ліцензії",
              whatLicensed: "Видана на",
              issuedDate: "Дата видачі",
              issuedBy: "Орган, що видав",
              validateDate: "Термін дії",
              orderNo: "Номер наказу"
            }}
            renderRow={({
              activeFromDate,
              expiryDate,
              issuedDate,
              ...licenses
            }) => ({
              validateDate: `з ${format(activeFromDate, "DD.MM.YYYY")} ${
                expiryDate ? `по ${format(expiryDate, "DD.MM.YYYY")}` : ""
              }`,
              issuedDate: format(issuedDate, "DD.MM.YYYY"),
              ...licenses
            })}
            tableName="legal-entities/licenses"
          />
        </>
      )}

      <OpacityBox mt={5} opacity={isVerificationActive ? 1 : 0.5}>
        <Popup
          variant="green"
          buttonText={nhsComment ? "Дивитись коментарі" : "Залишити коментар"}
          title={nhsComment ? "Коментар" : "Залишити коментар"}
          icon={CommentIcon}
          disabled={!isVerificationActive}
        >
          {toggle => (
            <Mutation
              mutation={NhsCommentLegalEntityMutation}
              refetchQueries={() => [
                {
                  query: LegalEntityQuery,
                  variables: { id, first: 10 }
                }
              ]}
            >
              {nhsCommentLegalEntity => (
                <BooleanValue defaultValue={!nhsComment}>
                  {({ value: showForm, toggle: toggleForm }) =>
                    showForm ? (
                      <Form
                        initialValues={{ nhsComment }}
                        onSubmit={async ({ nhsComment }) => {
                          await nhsCommentLegalEntity({
                            variables: { input: { id, nhsComment } }
                          });
                          toggle();
                        }}
                      >
                        <Field.Textarea
                          name="nhsComment"
                          placeholder="Введіть коментар"
                          rows={5}
                          maxlength="3000"
                        />
                        <Flex justifyContent="left">
                          <Box mr={20}>
                            <Button variant="blue" onClick={toggle}>
                              Закрити
                            </Button>
                          </Box>
                          <Button type="submit" variant="green">
                            Коментувати
                          </Button>
                        </Flex>
                      </Form>
                    ) : (
                      <>
                        <CommentBox>{nhsComment}</CommentBox>
                        <Flex justifyContent="left">
                          <Box mr={20}>
                            <Button variant="blue" onClick={toggle}>
                              Закрити
                            </Button>
                          </Box>
                          <Box mr={20}>
                            <Button
                              variant="red"
                              onClick={async () => {
                                await nhsCommentLegalEntity({
                                  variables: {
                                    input: { id, nhsComment: "" }
                                  }
                                });
                                toggle();
                              }}
                            >
                              Видалити
                            </Button>
                          </Box>
                          <Box>
                            <Button variant="green" onClick={toggleForm}>
                              Редагувати коментар
                            </Button>
                          </Box>
                        </Flex>
                      </>
                    )
                  }
                </BooleanValue>
              )}
            </Mutation>
          )}
        </Popup>

        <Line />
        <DefinitionListView
          labels={{
            nhsVerified: "Верифікація НСЗУ"
          }}
          data={{
            nhsVerified: nhsVerified ? <PositiveIcon /> : <NegativeIcon />
          }}
        />

        <Box mt={3}>
          {nhsVerified ? (
            <NhsVerifyButton
              id={id}
              variant="red"
              title="Скасувати верифікацію"
              isVerificationActive={isVerificationActive}
              nhsVerified={!nhsVerified}
            />
          ) : (
            <NhsVerifyButton
              id={id}
              variant="green"
              title="Верифікувати медзаклад"
              isVerificationActive={isVerificationActive}
              nhsVerified={!nhsVerified}
            />
          )}
        </Box>
      </OpacityBox>
    </Box>
  );
};
const RelatedLegalEntities = ({ id, status, mergedToLegalEntity }) => (
  <Ability action="read" resource="related_legal_entities">
    <LocationParams>
      {({ locationParams, setLocationParams }) => (
        <>
          <Flex justifyContent="space-between">
            <Box px={1}>
              <Form onSubmit={setLocationParams} initialValues={locationParams}>
                <Box px={5} pt={5} width={460}>
                  <Field.Text
                    name="mergedFromLegalEntity.edrpou"
                    label="Знайти підпорядкований медзаклад"
                    placeholder="Введіть ЄДРПОУ медзакладу"
                    postfix={<AdminSearchIcon color="#CED0DA" />}
                  />
                </Box>
              </Form>
            </Box>
            <Box pt={5} pl={4} css={{ textAlign: "right" }}>
              {mergedToLegalEntity ? (
                <Tooltip
                  placement="top"
                  content="Увага, медзаклад було реорганізовано"
                  component={() => (
                    <Link
                      to={`../../${mergedToLegalEntity.mergedToLegalEntity.id}`}
                      fontWeight="bold"
                    >
                      Перейти до основного закладу
                    </Link>
                  )}
                />
              ) : status === "ACTIVE" ? (
                <Link to="../add" fontWeight="bold">
                  <Flex mb={2}>
                    <Box mr={2}>
                      <AdminAddIcon width={16} height={16} />
                    </Box>{" "}
                    Додати підпорядкований медзаклад
                  </Flex>
                </Link>
              ) : null}
            </Box>
          </Flex>
          <Query
            query={LegalEntityQuery}
            variables={{
              id,
              first: 10,
              mergeLegalEntityFilter: locationParams
            }}
          >
            {({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error) return `Error! ${error.message}`;
              const {
                legalEntity: {
                  mergedFromLegalEntities: { nodes }
                }
              } = data;
              const { orderBy } = locationParams;
              return nodes.length ? (
                <Table
                  data={nodes}
                  header={{
                    name: "Назва Медзакладу",
                    edrpou: "ЄДРПОУ",
                    reason: "Основа",
                    insertedAt: "Додано",
                    isActive: "Статус"
                  }}
                  renderRow={({
                    reason,
                    insertedAt,
                    mergedFromLegalEntity: { edrpou, name },
                    isActive
                  }) => ({
                    reason,
                    insertedAt: format(insertedAt, "DD.MM.YYYY, HH:mm"),
                    name,
                    edrpou,
                    isActive: (
                      <Badge
                        name={isActive ? "ACTIVE" : "CLOSED"}
                        type="LEGALENTITY"
                        display="block"
                      />
                    )
                  })}
                  sortableFields={["insertedAt", "isActive"]}
                  sortingParams={parseSortingParams(orderBy)}
                  onSortingChange={sortingParams =>
                    setLocationParams({
                      orderBy: stringifySortingParams(sortingParams)
                    })
                  }
                  tableName="mergedFromLegalEntities"
                />
              ) : null;
            }}
          </Query>
        </>
      )}
    </LocationParams>
  </Ability>
);

const Owner = ({
  owner: { party, databaseId, position, additionalInfo: doctor }
}) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        party: "ПІБ",
        speciality: "Спеціальність",
        position: "Посада"
      }}
      data={{
        party: getFullName(party),
        speciality:
          doctor.specialities &&
          doctor.specialities.map(({ speciality }, index, array) => (
            <React.Fragment key={index}>
              {speciality}
              {array.length - 1 !== index && ", "}
            </React.Fragment>
          )),
        position
      }}
    />
    <DefinitionListView
      labels={{ databaseId: "Id" }}
      data={{ databaseId }}
      color="blueberrySoda"
    />
  </Box>
);

const Divisions = ({ id }) => (
  <Ability action="read" resource="division">
    <LocationParams>
      {({ locationParams, setLocationParams }) => (
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
            query={LegalEntityQuery}
            variables={{
              id,
              first: 10,
              divisionFilter: locationParams
            }}
          >
            {({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error) return `Error! ${error.message}`;
              const {
                legalEntity: {
                  divisions: { nodes: divisions }
                }
              } = data;
              return divisions.length ? (
                <Table
                  data={divisions}
                  header={{
                    name: "Назва Медзакладу",
                    addresses: "Адреса",
                    mountainGroup: "Гірський регіон",
                    phones: "Телефон",
                    email: "Email"
                  }}
                  renderRow={({
                    mountainGroup,
                    addresses,
                    phones,
                    ...props
                  }) => ({
                    ...props,
                    mountainGroup: (
                      <Flex justifyContent="center">
                        {mountainGroup ? <PositiveIcon /> : <NegativeIcon />}
                      </Flex>
                    ),
                    addresses: addresses
                      .filter(a => a.type === "RESIDENCE")
                      .map((item, key) => (
                        <AddressView data={item} key={key} />
                      )),
                    phones: getPhones(phones)
                  })}
                />
              ) : null;
            }}
          </Query>
        </>
      )}
    </LocationParams>
  </Ability>
);

const Popup = ({
  variant,
  buttonText,
  icon: Icon,
  title,
  children,
  disabled,
  render = children
}) => {
  const ButtonComponent = Icon ? IconButton : Button;
  return (
    <BooleanValue>
      {({ value: opened, toggle }) => (
        <>
          <ButtonComponent
            icon={CommentIcon}
            variant={variant}
            disabled={disabled}
            onClick={toggle}
          >
            {buttonText}
          </ButtonComponent>

          {opened && (
            <Modal width={760} backdrop textAlign="left">
              {Icon ? (
                <Flex pb={4}>
                  <Icon />
                  <Box ml={2}>{title}</Box>
                </Flex>
              ) : (
                <Heading as="h1" fontWeight="normal" textAlign="center" mb={6}>
                  {title}
                </Heading>
              )}
              {render(toggle)}
            </Modal>
          )}
        </>
      )}
    </BooleanValue>
  );
};

export default Details;

const NhsVerifyButton = ({
  id,
  variant,
  title,
  nhsVerified,
  isVerificationActive
}) => (
  <Popup
    variant={variant}
    buttonText={title}
    title={title}
    disabled={!isVerificationActive}
  >
    {toggle => (
      <Mutation
        mutation={NhsVerifyLegalEntityMutation}
        refetchQueries={() => [
          {
            query: LegalEntityQuery,
            variables: { id, first: 10 }
          }
        ]}
      >
        {nhsVerifyLegalEntity => (
          <Flex justifyContent="center">
            <Box mr={20}>
              <Button variant="blue" onClick={toggle}>
                Повернутися
              </Button>
            </Box>
            <Button
              onClick={async () => {
                await nhsVerifyLegalEntity({
                  variables: {
                    input: {
                      id,
                      nhsVerified
                    }
                  }
                });
                toggle();
              }}
              variant={variant}
            >
              {title}
            </Button>
          </Flex>
        )}
      </Mutation>
    )}
  </Popup>
);

const OpacityBox = system({ is: Box, opacity: 1 });

const ArchiveBox = system(
  {
    is: Box,
    mb: 6
  },
  `
    &:last-child {
      margin-bottom: 0;
    }
  `
);

const CommentBox = system(
  {
    is: Box,
    pt: 2,
    pb: 5
  },
  `
    white-space: pre-line;
  `
);
