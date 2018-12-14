import React from "react";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { Flex, Box, Heading, Text } from "rebass/emotion";
import { BooleanValue } from "react-values";
import { loader } from "graphql.macro";
import { Trans } from "@lingui/macro";
import { Form, Modal, LocationParams } from "@ehealth/components";
import { AdminSearchIcon } from "@ehealth/icons";
import {
  parseSortingParams,
  stringifySortingParams,
  getFullName
} from "@ehealth/utils";

import Tabs from "../../components/Tabs";
import Link from "../../components/Link";
import LoadingOverlay from "../../components/LoadingOverlay";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import Breadcrumbs from "../../components/Breadcrumbs";
import AddressView from "../../components/AddressView";
import DefinitionListView from "../../components/DefinitionListView";

import STATUSES from "../../helpers/statuses";

const PersonDeclarationsQuery = loader(
  "../../graphql/PersonDeclarationsQuery.graphql"
);
const ResetAuthMethodMutation = loader(
  "../../graphql/ResetAuthMethodMutation.graphql"
);
const PersonQuery = loader("../../graphql/PersonQuery.graphql");

const filterData = (type, arr) => arr.filter(t => t.type === type);

const declarationStatuses = Object.entries(STATUSES.DECLARATION).map(
  ([name, value]) => ({ name, value })
);

const Details = ({ id }) => (
  <Query query={PersonQuery} variables={{ id }}>
    {({ loading, error, data: { person = {} } = {} }) => {
      if (error) return `Error! ${error.message}`;
      const {
        id,
        status,
        firstName,
        secondName,
        lastName,
        birthDate,
        birthCountry,
        birthSettlement,
        taxId,
        unzr,
        phones = [],
        authenticationMethods
      } = person;

      const [mobilePhone] = filterData("MOBILE", phones);
      const [landLinePhone] = filterData("LAND_LINE", phones);
      const authInfo = authenticationMethods[0];

      const userInfo = {
        birthDate,
        birthCountry,
        birthSettlement,
        taxId,
        unzr,
        mobilePhone: mobilePhone && mobilePhone.number,
        landLinePhone: landLinePhone && landLinePhone.number
      };

      return (
        <LoadingOverlay loading={loading}>
          <Box p={6}>
            <Box mb={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/persons">
                  <Trans>Пошук пацієнтів</Trans>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Trans>Деталі пацієнта</Trans>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <DefinitionListView
              labels={{
                id: <Trans>ID пацієнта</Trans>,
                fullName: <Trans>ПІБ пацієнта</Trans>,
                status: <Trans>Статус</Trans>
              }}
              data={{
                id,
                fullName: getFullName({ firstName, secondName, lastName }),
                status: <Badge name={status} type="PERSON" minWidth={100} />
              }}
              color="#7F8FA4"
              labelWidth="100px"
            />
          </Box>
          <Tabs.Nav>
            <Tabs.NavItem to="./">
              <Trans>Особиста інформація</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./auth">
              <Trans>Метод аутентифікації</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./declarations">
              <Trans>Декларації</Trans>
            </Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Router>
              <UserInfo path="/" userInfo={userInfo} />
              <AuthInfo path="auth" authInfo={authInfo} />
              <DeclarationsInfo path="declarations" />
            </Router>
          </Tabs.Content>
        </LoadingOverlay>
      );
    }}
  </Query>
);

const UserInfo = ({ userInfo }) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        birthDate: <Trans>Дата народження</Trans>,
        birthCountry: <Trans>Країна народження</Trans>,
        birthSettlement: <Trans>Місце народження</Trans>,
        taxId: <Trans>ІНН</Trans>,
        unzr: <Trans>ID Запису в ЄДДР</Trans>,
        mobilePhone: <Trans>Мобільний номер</Trans>,
        landLinePhone: <Trans>Стаціонарний номер</Trans>
      }}
      data={userInfo}
    />
  </Box>
);

const AuthInfo = ({ id, authInfo }) =>
  authInfo ? (
    <Box p={5}>
      <DefinitionListView
        labels={{
          type: <Trans>Тип аутентифікації</Trans>,
          phoneNumber: <Trans>Номер телефону</Trans>
        }}
        data={authInfo}
      />
      {authInfo.type !== "NA" && (
        <Box>
          <Mutation mutation={ResetAuthMethodMutation}>
            {resetPersonAuthenticationMethod => (
              <BooleanValue>
                {({ value: opened, toggle }) => (
                  <>
                    <Button variant="green" disabled={opened} onClick={toggle}>
                      <Trans>Скинути метод аутентифікації</Trans>
                    </Button>
                    {opened && (
                      <Modal width={760} backdrop>
                        <Heading as="h1" fontWeight="normal" mb={6}>
                          <Trans>Зміна методу аутентифікації</Trans>
                        </Heading>
                        <Text lineHeight={2} textAlign="center" mb={6}>
                          <Trans>
                            Увага!
                            <br />
                            Після підтвердження, метод аутентифікації буде
                            змінено на невизначений
                          </Trans>
                        </Text>
                        <Flex justifyContent="center">
                          <Box mx={2}>
                            <Button variant="blue" onClick={toggle}>
                              <Trans>Повернутися</Trans>
                            </Button>
                          </Box>
                          <Box mx={2}>
                            <Button
                              variant="green"
                              onClick={async () => {
                                await resetPersonAuthenticationMethod({
                                  variables: { id }
                                });
                                toggle();
                              }}
                            >
                              <Trans>Скинути метод аутентифікації</Trans>
                            </Button>
                          </Box>
                        </Flex>
                      </Modal>
                    )}
                  </>
                )}
              </BooleanValue>
            )}
          </Mutation>
        </Box>
      )}
    </Box>
  ) : null;

const DeclarationsInfo = ({ id }) => (
  <LocationParams>
    {({
      locationParams: { orderBy, declarationId, status },
      setLocationParams
    }) => {
      return (
        <Query
          query={PersonDeclarationsQuery}
          variables={{
            id,
            filter: { declarationId, status: status && status.name },
            orderBy
          }}
        >
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            const {
              person: { declarations }
            } = data;
            return (
              <>
                <Form
                  onSubmit={() => null /* NOT USED, but required */}
                  initialValues={{ declarationId, status }}
                >
                  <Form.AutoSubmit onSubmit={setLocationParams} />
                  <Flex>
                    <Box px={5} pt={5} width={460}>
                      <Trans
                        id="Введіть ID або номер декларації"
                        render={({ translate }) => (
                          <Field.Text
                            name="declarationId"
                            label={<Trans>Пошук декларації</Trans>}
                            placeholder={translate}
                            postfix={<AdminSearchIcon color="#CED0DA" />}
                          />
                        )}
                      />
                    </Box>
                    <Box pt={5}>
                      <Field.Select
                        name="status"
                        label={<Trans>Статус декларації</Trans>}
                        items={[
                          { value: "всі статуси", name: undefined },
                          ...declarationStatuses
                        ]}
                        renderItem={item => item.value}
                        itemToString={item => {
                          if (!item) return "всі статуси";
                          return typeof item === "string" ? item : item.value;
                        }}
                        filterOptions={{ keys: ["value"] }}
                        type="select"
                      />
                    </Box>
                  </Flex>
                </Form>
                <Table
                  data={declarations}
                  header={{
                    id: "ID декларації",
                    declarationNumber: <Trans>Номер декларації</Trans>,
                    startDate: <Trans>Декларація діє з</Trans>,
                    name: <Trans>Медзаклад</Trans>,
                    edrpou: <Trans>ЄДРПОУ</Trans>,
                    divisionName: <Trans>Назва відділення</Trans>,
                    address: <Trans>Адреса</Trans>,
                    status: <Trans>Статус</Trans>,
                    action: <Trans>Дія</Trans>
                  }}
                  renderRow={({
                    id,
                    declarationNumber,
                    startDate,
                    legalEntity: { edrpou, name, addresses },
                    division: { name: divisionName },
                    status
                  }) => {
                    const [residenceAddress] = addresses.filter(
                      a => a.type === "RESIDENCE"
                    );
                    return {
                      id,
                      declarationNumber,
                      startDate,
                      name,
                      edrpou,
                      divisionName,
                      address: residenceAddress && (
                        <AddressView data={residenceAddress} />
                      ),
                      status: (
                        <Badge
                          name={status}
                          type="DECLARATION"
                          display="block"
                        />
                      ),
                      action: (
                        <Link to={`/declarations/${id}`}>
                          <Trans>Показати деталі</Trans>
                        </Link>
                      )
                    };
                  }}
                  sortableFields={["startDate", "status"]}
                  sortingParams={parseSortingParams(orderBy)}
                  onSortingChange={sortingParams =>
                    setLocationParams({
                      orderBy: stringifySortingParams(sortingParams)
                    })
                  }
                  hiddenFields="id"
                />
              </>
            );
          }}
        </Query>
      );
    }}
  </LocationParams>
);

export default Details;
