import React from "react";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { BooleanValue } from "react-values";
import { Flex, Box, Heading, Text } from "rebass/emotion";
import system from "system-components/emotion";
import { loader } from "graphql.macro";
import { DateFormat, Trans } from "@lingui/macro";
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
import { LocationParams, Form, Modal } from "@ehealth/components";

import Line from "../../components/Line";
import Link from "../../components/Link";
import Tabs from "../../components/Tabs";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import LoadingOverlay from "../../components/LoadingOverlay";
import Button, { IconButton } from "../../components/Button";
import Tooltip from "../../components/Tooltip";
import Ability from "../../components/Ability";
import * as Field from "../../components/Field";
import AddressView from "../../components/AddressView";
import Breadcrumbs from "../../components/Breadcrumbs";
import DictionaryValue from "../../components/DictionaryValue";
import DefinitionListView from "../../components/DefinitionListView";

import { ITEMS_PER_PAGE } from "../../constants/pagination";

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

//TODO: bring it out to the helper
const filteredLocationParams = (id, params = {}) => {
  const { filter, first, last, ...pagination } = params;
  return {
    id,
    ...pagination,
    ...filter,
    first:
      !first && !last ? ITEMS_PER_PAGE[0] : first ? parseInt(first) : undefined,
    last: last ? parseInt(last) : undefined
  };
};

const Details = ({ id }) => (
  <Query
    query={LegalEntityQuery}
    variables={{
      ...filteredLocationParams(id)
    }}
  >
    {({ loading, error, data: { legalEntity = {} } }) => {
      if (error) return `Error! ${error.message}`;
      const {
        id,
        databaseId,
        status,
        edrpou,
        name,
        addresses = [],
        phones = [],
        email,
        type,
        ownerPropertyType,
        kveds = [],
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
        <LoadingOverlay loading={loading}>
          <Box p={6}>
            <Box py={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/legal-entities">
                  <Trans>Search legal entities</Trans>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Trans>Legal entity details</Trans>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Flex justifyContent="space-between" alignItems="flex-end">
              <Box>
                <DefinitionListView
                  labels={{
                    databaseId: <Trans>Legal entity ID</Trans>,
                    status: <Trans>Status</Trans>
                  }}
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
                          variables: {
                            ...filteredLocationParams(id)
                          }
                        }
                      ]}
                    >
                      {nhsReviewLegalEntity => (
                        <Button
                          onClick={async () => {
                            await nhsReviewLegalEntity({
                              variables: {
                                input: {
                                  id
                                }
                              }
                            });
                          }}
                          variant="blue"
                        >
                          <Trans>To process</Trans>
                        </Button>
                      )}
                    </Mutation>
                  ) : (
                    <Popup
                      variant="red"
                      buttonText={<Trans>Close legal entity</Trans>}
                      title={<Trans>Close legal entity</Trans>}
                    >
                      {toggle => (
                        <Mutation
                          mutation={DeactivateLegalEntityMutation}
                          refetchQueries={() => [
                            {
                              query: LegalEntityQuery,
                              variables: {
                                ...filteredLocationParams(id)
                              }
                            }
                          ]}
                        >
                          {deactivateLegalEntity => (
                            <Flex justifyContent="center">
                              <Box mr={20}>
                                <Button variant="blue" onClick={toggle}>
                                  <Trans>Back</Trans>
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
                                <Trans>Close legal entity</Trans>
                              </Button>
                            </Flex>
                          )}
                        </Mutation>
                      )}
                    </Popup>
                  )}
                </>
              )}
            </Flex>
          </Box>

          <Tabs.Nav>
            <Tabs.NavItem to="./">
              <Trans>General info</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./licenses">
              <Trans>Licenses</Trans> / <Trans>Verification</Trans>
            </Tabs.NavItem>
            <Ability action="read" resource="related_legal_entities">
              <Tabs.NavItem to="./related-legal-entities">
                <Trans>Related legal entity</Trans>
              </Tabs.NavItem>
            </Ability>
            {owner && (
              <Tabs.NavItem to="./owner">
                <Trans>Owner</Trans>
              </Tabs.NavItem>
            )}
            <Ability action="read" resource="division">
              <Tabs.NavItem to="./divisions">
                <Trans>Divisions</Trans>
              </Tabs.NavItem>
            </Ability>
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
        </LoadingOverlay>
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
        edrpou: <Trans>EDRPOU</Trans>,
        name: <Trans>Name</Trans>,
        addresses: <Trans>Address</Trans>,
        phones: <Trans>Phone</Trans>,
        email: <Trans>Email</Trans>,
        website: <Trans>Website</Trans>,
        type: <Trans>Type</Trans>
      }}
      data={{
        ...props,
        addresses: addresses
          .filter(a => a.type === "REGISTRATION")
          .map((item, key) => <AddressView data={item} key={key} />),
        phones: getPhones(phones),
        type: <DictionaryValue name="LEGAL_ENTITY_TYPE" item={type} />
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        ownerPropertyType: <Trans>Тип власності</Trans>,
        legalForm: <Trans>Форма господарювання</Trans>,
        kveds: <Trans>КВЕДи</Trans>,
        receiverFundsCode: <Trans>Код одержувача бюджетних коштів</Trans>,
        beneficiary: <Trans>Вигодонабувач</Trans>
      }}
      data={{
        ownerPropertyType: (
          <DictionaryValue
            name="OWNER_PROPERTY_TYPE"
            item={ownerPropertyType}
          />
        ),
        legalForm: <DictionaryValue name="LEGAL_FORM" item={legalForm} />,
        beneficiary,
        receiverFundsCode,
        kveds: (
          <DictionaryValue
            name="KVEDS"
            render={dict => (
              <>
                {kveds.map((el, key, arr) => (
                  <React.Fragment key={key}>
                    {dict[el]}
                    {key !== arr.length - 1 && ", "}
                  </React.Fragment>
                ))}
              </>
            )}
          />
        )
      }}
    />
    <DefinitionListView
      labels={{
        misVerified: <Trans>Верифікація МІС</Trans>
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
          <Trans>Архів</Trans>
        </Heading>

        {archive.map(({ date, place }, index) => (
          <ArchiveBox key={index}>
            <DefinitionListView
              labels={{
                date: <Trans>Дата архівування</Trans>,
                place: <Trans>Місце зберігання</Trans>
              }}
              data={{
                date: <DateFormat value={date} />,
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
  const { accreditation, licenses } = license || {};

  return (
    <Box p={5}>
      {!isEmpty(accreditation) && (
        <>
          <Heading fontSize="1" fontWeight="normal" mb={5}>
            <Trans>Акредитація</Trans>
          </Heading>
          <DefinitionListView
            labels={{
              category: <Trans>Категорія</Trans>,
              validateDate: <Trans>Термін дії</Trans>,
              orderDate: <Trans>Дата наказу</Trans>,
              orderNo: <Trans>Номер наказу</Trans>
            }}
            data={{
              ...accreditation,
              category: accreditation.category && (
                <DictionaryValue
                  name="ACCREDITATION_CATEGORY"
                  item={accreditation.category}
                />
              ),
              validateDate: (
                <>
                  з <DateFormat value={accreditation.issuedDate} />{" "}
                  {accreditation.expiryDate ? (
                    <>
                      по <DateFormat value={accreditation.expiryDate} />
                    </>
                  ) : (
                    ""
                  )}
                </>
              ),
              orderDate: <DateFormat value={accreditation.orderDate} />
            }}
          />
          <Line />
        </>
      )}
      {!isEmpty(licenses) && (
        <>
          <Heading fontSize="1" fontWeight="normal" mb={5}>
            <Trans>Ліцензії</Trans>
          </Heading>

          <Table
            data={licenses}
            header={{
              licenseNumber: <Trans>Номер ліцензії</Trans>,
              whatLicensed: <Trans>Видана на</Trans>,
              issuedDate: <Trans>Дата видачі</Trans>,
              issuedBy: <Trans>Орган, що видав</Trans>,
              validateDate: <Trans>Термін дії</Trans>,
              orderNo: <Trans>Номер наказу</Trans>
            }}
            renderRow={({
              activeFromDate,
              expiryDate,
              issuedDate,
              ...licenses
            }) => ({
              validateDate: (
                <>
                  <>
                    з <DateFormat value={activeFromDate} />{" "}
                    {expiryDate ? (
                      <>
                        по <DateFormat value={expiryDate} />
                      </>
                    ) : (
                      ""
                    )}
                  </>
                </>
              ),
              issuedDate: <DateFormat value={issuedDate} />,
              ...licenses
            })}
            tableName="legal-entities/licenses"
          />
          <Line />
        </>
      )}

      <OpacityBox mt={5} opacity={isVerificationActive ? 1 : 0.5}>
        <Heading fontSize="1" fontWeight="normal" mb={5}>
          <Trans>Верифікація</Trans>
        </Heading>
        <DefinitionListView
          labels={{
            nhsVerified: <Trans>Верифікація НСЗУ</Trans>
          }}
          data={{
            nhsVerified: nhsVerified ? <PositiveIcon /> : <NegativeIcon />
          }}
        />
        <Box mt={3} mb={4}>
          <NhsVerifyButton
            id={id}
            isVerificationActive={isVerificationActive}
            nhsVerified={nhsVerified}
          />
        </Box>
        <Popup
          variant="green"
          buttonText={
            nhsComment ? (
              <Trans>Редагувати коментар</Trans>
            ) : (
              <Trans>Залишити коментар</Trans>
            )
          }
          title={
            nhsComment ? (
              <Trans>Коментар</Trans>
            ) : (
              <Trans>Залишити коментар</Trans>
            )
          }
          icon={CommentIcon}
          disabled={!isVerificationActive}
        >
          {toggle => (
            <Mutation
              mutation={NhsCommentLegalEntityMutation}
              refetchQueries={() => [
                {
                  query: LegalEntityQuery,
                  variables: {
                    ...filteredLocationParams(id)
                  }
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
                        <Trans
                          id="Введіть коментар"
                          render={({ translate }) => (
                            <Field.Textarea
                              name="nhsComment"
                              placeholder={translate}
                              rows={5}
                              maxlength="3000"
                            />
                          )}
                        />
                        <Flex justifyContent="left">
                          <Box mr={20}>
                            <Button variant="blue" onClick={toggle}>
                              <Trans>Закрити</Trans>
                            </Button>
                          </Box>
                          <Button type="submit" variant="green">
                            <Trans>Залишити коментар</Trans>
                          </Button>
                        </Flex>
                      </Form>
                    ) : (
                      <>
                        <CommentBox>{nhsComment}</CommentBox>
                        <Flex justifyContent="left">
                          <Box mr={20}>
                            <Button variant="blue" onClick={toggle}>
                              <Trans>Закрити</Trans>
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
                              <Trans>Видалити</Trans>
                            </Button>
                          </Box>
                          <Box>
                            <Button variant="green" onClick={toggleForm}>
                              <Trans>Редагувати коментар</Trans>
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
        {nhsComment && <BorderBox>{nhsComment}</BorderBox>}
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
                  <Trans
                    id="Введіть ЄДРПОУ медзакладу"
                    render={({ translate }) => (
                      <Field.Text
                        name="filter.mergeLegalEntityFilter.mergedFromLegalEntity.edrpou"
                        label={<Trans>Знайти підпорядкований медзаклад</Trans>}
                        placeholder={translate}
                        postfix={<AdminSearchIcon color="#CED0DA" />}
                      />
                    )}
                  />
                </Box>
              </Form>
            </Box>
            <Box pt={5} pl={4} css={{ textAlign: "right" }}>
              {mergedToLegalEntity ? (
                <Tooltip
                  placement="top"
                  content={<Trans>Увага, медзаклад було реорганізовано</Trans>}
                  component={() => (
                    <Link
                      to={`../../${mergedToLegalEntity.mergedToLegalEntity.id}`}
                      fontWeight="bold"
                    >
                      <Trans>Перейти до основного закладу</Trans>
                    </Link>
                  )}
                />
              ) : status === "ACTIVE" ? (
                <Link to="../add" fontWeight="bold">
                  <Flex mb={2}>
                    <Box mr={2}>
                      <AdminAddIcon width={16} height={16} />
                    </Box>{" "}
                    <Trans>Додати підпорядкований медзаклад</Trans>
                  </Flex>
                </Link>
              ) : null}
            </Box>
          </Flex>
          <Query
            query={LegalEntityQuery}
            variables={{
              ...filteredLocationParams(id, locationParams)
            }}
          >
            {({ loading, error, data = {} }) => {
              if (error) return `Error! ${error.message}`;
              const {
                legalEntity: {
                  mergedFromLegalEntities: { nodes = [] } = {}
                } = {}
              } = data;
              const { orderBy } = locationParams;
              return (
                <LoadingOverlay loading={loading}>
                  {nodes.length > 0 ? (
                    <Table
                      data={nodes}
                      header={{
                        name: <Trans>Назва Медзакладу</Trans>,
                        edrpou: <Trans>ЄДРПОУ</Trans>,
                        reason: <Trans>Основа</Trans>,
                        insertedAt: <Trans>Додано</Trans>,
                        isActive: <Trans>Статус</Trans>
                      }}
                      renderRow={({
                        reason,
                        insertedAt,
                        mergedFromLegalEntity: { edrpou, name },
                        isActive
                      }) => ({
                        reason,
                        insertedAt: <DateFormat value={insertedAt} />,
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
                  ) : (
                    <EmptyData />
                  )}
                </LoadingOverlay>
              );
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
        party: <Trans>ПІБ</Trans>,
        speciality: <Trans>Спеціальність</Trans>,
        position: <Trans>Посада</Trans>
      }}
      data={{
        party: getFullName(party),
        speciality: doctor.specialities && (
          <DictionaryValue
            name="SPECIALITY_TYPE"
            render={dict => (
              <>
                {doctor.specialities.map(({ speciality }, index, array) => (
                  <React.Fragment key={index}>
                    {dict[speciality]}
                    {array.length - 1 !== index && ", "}
                  </React.Fragment>
                ))}
              </>
            )}
          />
        ),

        position: <DictionaryValue name="POSITION" item={position} />
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
              <Trans
                id="Введіть назву відділення"
                render={({ translate }) => (
                  <Field.Text
                    name="filter.divisionFilter.name"
                    label={<Trans>Знайти відділення</Trans>}
                    placeholder={translate}
                    postfix={<AdminSearchIcon color="#CED0DA" />}
                  />
                )}
              />
            </Box>
          </Form>
          <Query
            query={LegalEntityQuery}
            variables={{
              ...filteredLocationParams(id, locationParams)
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
                    name: <Trans>Назва Медзакладу</Trans>,
                    addresses: <Trans>Адреса</Trans>,
                    mountainGroup: <Trans>Гірський регіон</Trans>,
                    phones: <Trans>Телефон</Trans>,
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

const NhsVerifyButton = ({ id, nhsVerified, isVerificationActive }) => {
  const variant = nhsVerified ? "red" : "green";
  const title = nhsVerified ? (
    <Trans>Скасувати верифікацію</Trans>
  ) : (
    <Trans>Верифікувати медзаклад</Trans>
  );

  return (
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
              variables: {
                ...filteredLocationParams(id)
              }
            }
          ]}
        >
          {nhsVerifyLegalEntity => (
            <Flex justifyContent="center">
              <Box mr={20}>
                <Button variant="blue" onClick={toggle}>
                  <Trans>Повернутися</Trans>
                </Button>
              </Box>
              <Button
                onClick={async () => {
                  await nhsVerifyLegalEntity({
                    variables: {
                      input: {
                        id,
                        nhsVerified: !nhsVerified
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
};

const EmptyData = props => (
  <Text color="shiningKnight" {...props} fontSize={1} mx={6} my={2}>
    Інформація відсутня
  </Text>
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

const BorderBox = system(
  {
    is: Box,
    p: 4,
    mb: 5,
    fontSize: 0,
    lineHeight: 1.5,
    maxHeight: 200,
    border: "1px solid #dfe2e5"
  },
  `
    white-space: pre-line;
    overflow-y: scroll;
  `
);
