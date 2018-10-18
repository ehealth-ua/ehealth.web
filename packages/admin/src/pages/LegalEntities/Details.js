import React from "react";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import system from "system-components/emotion";
import { BooleanValue } from "react-values";
import { Flex, Box, Heading } from "rebass/emotion";
import format from "date-fns/format";

import { PositiveIcon, AdminSearchIcon, AdminAddIcon } from "@ehealth/icons";
import {
  getFullName,
  getPhones,
  parseSortingParams,
  stringifySortingParams
} from "@ehealth/utils";
import { LocationParams, Form, Modal, Switch } from "@ehealth/components";

import Link from "../../components/Link";
import Tabs from "../../components/Tabs";
import Table from "../../components/Table";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Ability from "../../components/Ability";
import * as Field from "../../components/Field";
import AddressView from "../../components/AddressView";
import Breadcrumbs from "../../components/Breadcrumbs";
import DefinitionListView from "../../components/DefinitionListView";

import STATUSES from "../../helpers/statuses";

import DeactivateLegalEntityMutation from "../../graphql/DeactivateLegalEntityMutation.graphql";
import NhsVerifyLegalEntityMutation from "../../graphql/NhsVerifyLegalEntityMutation.graphql";
import LegalEntityQuery from "../../graphql/LegalEntityQuery.graphql";

const Details = ({ id }) => (
  <Query query={LegalEntityQuery} variables={{ id }}>
    {({ loading, error, data: { legalEntity } }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      const {
        id,
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
        owner,
        medicalServiceProvider
      } = legalEntity;
      // const { nodes: divisions } = legalEntity.divisions;
      const statusAction =
        status === "ACTIVE" && (nhsVerified ? status : "NHS_VERIFY_CLOSED");

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
                  labels={{ id: "ID медзакладу", status: "Статус" }}
                  data={{
                    id,
                    status: (
                      <Badge name={status} type="LEGALENTITY" minWidth={100} />
                    )
                  }}
                  color="#7F8FA4"
                  labelWidth="100px"
                />
              </Box>
              <Switch
                value={statusAction}
                ACTIVE={
                  <Popup
                    variant="red"
                    buttonText="Закрити медзаклад"
                    title="Закрити медзаклад"
                  >
                    {toggle => (
                      <Mutation mutation={DeactivateLegalEntityMutation}>
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
                                    id
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
                }
                NHS_VERIFY_CLOSED={
                  <Flex>
                    <Box mr={20}>
                      <Popup
                        variant="red"
                        buttonText="Закрити медзаклад"
                        title="Закрити медзаклад"
                      >
                        {toggle => (
                          <Mutation mutation={DeactivateLegalEntityMutation}>
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
                                        id
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
                    <Popup
                      variant="green"
                      buttonText="Верифікація"
                      title="Верифікація медзакладу"
                    >
                      {toggle => (
                        <Mutation mutation={NhsVerifyLegalEntityMutation}>
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
                                      id
                                    }
                                  });
                                  toggle();
                                }}
                                variant="green"
                              >
                                Верифікувати медзаклад
                              </Button>
                            </Flex>
                          )}
                        </Mutation>
                      )}
                    </Popup>
                  </Flex>
                }
              />
            </Flex>
          </Box>

          <Tabs.Nav>
            <Tabs.NavItem to="./">Загальна інформація</Tabs.NavItem>
            <Tabs.NavItem to="./licenses">Ліцензії</Tabs.NavItem>
            <Ability action="read" resource="related_legal_entities">
              <Tabs.NavItem to="./related-legal-entities">
                Підпорядковані медзаклади
              </Tabs.NavItem>
            </Ability>
            <Tabs.NavItem to="./owner">Власник</Tabs.NavItem>
            <Ability action="read" resource="division">
              <Tabs.NavItem to="./divisions">Відділення</Tabs.NavItem>
            </Ability>
            <Tabs.NavItem to="./requests-for-contract">
              Запити на контракт
            </Tabs.NavItem>
            <Tabs.NavItem to="./contracts">Контракти</Tabs.NavItem>
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
                nhsVerified={nhsVerified}
              />
              <License path="/licenses" license={medicalServiceProvider} />
              <RelatedLegalEntities
                path="/related-legal-entities"
                status={status}
              />
              {/*<Owner path="/owner" owner={owner} />*/}
              {/*<Divisions path="/divisions" divisions={divisions} />*/}
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
  nhsVerified,
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
        type: "Тип"
      }}
      data={{
        ...props,
        addresses: addresses
          .filter(a => a.type === "ACTIVE")
          .map((item, key) => <AddressView data={item} key={key} />),
        phones: getPhones(phones),
        type: STATUSES.LEGAL_ENTITY_TYPE[type]
      }}
    />
    <Line />
    <DefinitionListView
      labels={{
        ownerPropertyType: "Тип власності",
        kveds: "КВЕДи",
        misVerified: <GreyTitle>Верифікація МІС</GreyTitle>,
        nhsVerified: <GreyTitle>Верифікація НСЗУ</GreyTitle>
      }}
      data={{
        ownerPropertyType,
        kveds: kveds.map((el, key, arr) => (
          <React.Fragment key={key}>
            {el}
            {key !== arr.length - 1 && ", "}
          </React.Fragment>
        )),
        misVerified: misVerified && <PositiveIcon />,
        nhsVerified: nhsVerified && <PositiveIcon />
      }}
    />
  </Box>
);
const License = ({ license: { accreditation, licenses = [] } }) => {
  const { issuedDate, expiryDate } = accreditation;
  return (
    <Box p={5}>
      <DefinitionListView
        labels={{
          category: "Акредитація",
          validateDate: "Термін дії"
        }}
        data={{
          ...accreditation,
          validateDate: `з ${issuedDate} по ${expiryDate}`
        }}
      />
      <Line />
      {licenses.map(({ issuedDate, expiryDate, ...item }, index, array) => (
        <React.Fragment key={index}>
          <DefinitionListView
            labels={{
              licenseNumber: "Ліцензія",
              validateDate: "Термін дії",
              whatLicensed: "Орган, що видав",
              activeFromDate: "Актуальність"
            }}
            data={{
              ...item,
              validateDate: `з ${issuedDate} по ${expiryDate}`
            }}
          />
          {array.length - 1 !== index && <Line />}
        </React.Fragment>
      ))}
    </Box>
  );
};
const RelatedLegalEntities = ({ id, status }) => (
  <Ability action="read" resource="related_legal_entities">
    <LocationParams>
      {({ locationParams, setLocationParams }) => (
        <Query
          query={LegalEntityQuery}
          variables={{
            id,
            ...locationParams
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
            return (
              <>
                <Form
                  onSubmit={setLocationParams}
                  initialValues={locationParams}
                >
                  <Box px={5} pt={5} width={460}>
                    <Field.Text
                      name="filter.edrpou"
                      label="Знайти підпорядкований медзаклад"
                      placeholder="Введіть ЄДРПОУ медзакладу"
                      postfix={<AdminSearchIcon color="#CED0DA" />}
                    />
                  </Box>
                </Form>
                {status === "ACTIVE" && (
                  <Link to="../add">
                    <Flex mb={2}>
                      <Box mr={2}>
                        <AdminAddIcon width={16} height={16} />
                      </Box>{" "}
                      Додати підпорядкований медзаклад
                    </Flex>
                  </Link>
                )}
                <Table
                  data={nodes}
                  header={{
                    name: "Назва Медзакладу",
                    edrpou: "ЄДРПОУ",
                    base: "Основа",
                    insertedAt: "Додано",
                    isActive: "Статус"
                  }}
                  renderRow={({
                    base,
                    insertedAt,
                    mergedFromLegalEntity: { edrpou, name },
                    isActive
                  }) => ({
                    base,
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
                  sortableFields={["edrpou", "insertedAt", "isActive"]}
                  sortingParams={parseSortingParams(orderBy)}
                  onSortingChange={sortingParams =>
                    setLocationParams({
                      orderBy: stringifySortingParams(sortingParams)
                    })
                  }
                  tableName="mergedFromLegalEntities"
                />
              </>
            );
          }}
        </Query>
      )}
    </LocationParams>
  </Ability>
);

const Owner = ({ owner: { party, id, position, doctor } }) => (
  <Box p={5}>
    <DefinitionListView
      labels={{
        party: "ПІБ",
        speciality: "Спеціальність",
        position: "Посада",
        id: <GreyTitle>Id</GreyTitle>
      }}
      data={{
        party: getFullName(party),
        speciality: doctor.specialities.map(({ speciality }, index, array) => (
          <React.Fragment key={index}>
            {speciality}
            {array.length - 1 !== index && ", "}
          </React.Fragment>
        )),
        position,
        id: <GreyTitle>{id}</GreyTitle>
      }}
    />
  </Box>
);

const Divisions = ({ divisions, id }) => (
  <Ability action="read" resource="division">
    <LocationParams>
      {({ locationParams, setLocationParams }) => (
        <>
          <Form onSubmit={setLocationParams} initialValues={locationParams}>
            <Box p={5} width={460}>
              <Field.Text
                name="filter.name"
                label="Знайти відділення"
                placeholder="Введіть назву відділення"
                postfix={<AdminSearchIcon color="#CED0DA" />}
              />
            </Box>
          </Form>

          <Table
            data={divisions}
            header={{
              name: "Назва Медзакладу",
              addresses: "Адреса",
              mountainGroup: "Гірський регіон",
              phones: "Телефон",
              email: "Email"
            }}
            renderRow={({ mountainGroup, addresses, phones, ...props }) => ({
              ...props,
              mountainGroup: mountainGroup && <PositiveIcon />,
              addresses: addresses
                .filter(a => a.type === "RESIDENCE")
                .map((item, key) => <AddressView data={item} key={key} />),
              phones: getPhones(phones)
            })}
          />
        </>
      )}
    </LocationParams>
  </Ability>
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

const Line = system({
  is: "figure",
  bg: "januaryDawn",
  my: 5,
  mx: 0,
  height: "1px",
  w: "100%"
});

const GreyTitle = system({
  color: "shiningKnight",
  fontWeight: 500
});

export default Details;
