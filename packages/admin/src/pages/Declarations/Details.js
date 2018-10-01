import React from "react";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { Flex, Box, Heading } from "rebass/emotion";
import { BooleanValue } from "react-values";

import { PositiveIcon } from "@ehealth/icons";
import { getFullName, getPhones } from "@ehealth/utils";
import { Form, Modal, Switch } from "@ehealth/components";

import Tabs from "../../components/Tabs";
import Link from "../../components/Link";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import * as Field from "../../components/Field";
import AddressView from "../../components/AddressView";
import Breadcrumbs from "../../components/Breadcrumbs";
import DefinitionListView from "../../components/DefinitionListView";

import STATUSES from "../../helpers/statuses";

import DeclarationQuery from "../../graphql/DeclarationQuery.graphql";
import TerminateDeclarationMutation from "../../graphql/TerminateDeclarationMutation.graphql";
import RejectDeclarationMutation from "../../graphql/RejectDeclarationMutation.graphql";
import ApproveDeclarationMutation from "../../graphql/ApproveDeclarationMutation.graphql";

const Details = ({ id }) => (
  <Query query={DeclarationQuery} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      const {
        id,
        declarationNumber,
        startDate,
        endDate,
        status,
        scope,
        reason,
        declarationRequestId,
        legalEntity,
        division,
        employee,
        person
      } = data.declaration;

      const general = {
        declarationNumber,
        startDate,
        endDate,
        status: STATUSES.DECLARATION[status],
        scope,
        reason
      };
      return (
        <>
          <Box p={6}>
            <Box mb={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/declarations">
                  Пошук декларацій
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>Деталі декларації</Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Flex justifyContent="space-between" alignItems="flex-end">
              <Box>
                <DefinitionListView
                  labels={{
                    id: "ID пацієнта",
                    declarationRequestId: "ID запиту",
                    status: "Статус"
                  }}
                  data={{
                    id,
                    declarationRequestId,
                    status: (
                      <Badge bg="darkPastelGreen" minWidth={100}>
                        {STATUSES.DECLARATION[status]}
                      </Badge>
                    )
                  }}
                  color="#7F8FA4"
                  labelWidth="100px"
                />
              </Box>
              <Box>
                <Switch
                  value={status}
                  ACTIVE={
                    <Popup
                      variant="red"
                      buttonText="Розірвати декларацію"
                      title="Розірвання декларації"
                    >
                      {toggle => (
                        <Mutation mutation={TerminateDeclarationMutation}>
                          {terminateDeclaration => (
                            <Form
                              onSubmit={async reasonDescription => {
                                await terminateDeclaration({
                                  variables: { id, reasonDescription }
                                });
                                toggle();
                              }}
                            >
                              <Field.Textarea
                                name="reasonDescription"
                                placeholder="Вкажіть причину розірвання декларації"
                                rows={5}
                              />
                              <Flex justifyContent="center">
                                <Box mr={20}>
                                  <Button variant="blue" onClick={toggle}>
                                    Повернутися
                                  </Button>
                                </Box>
                                <Button type="submit" variant="red">
                                  Розірвати декларацію
                                </Button>
                              </Flex>
                            </Form>
                          )}
                        </Mutation>
                      )}
                    </Popup>
                  }
                  PENDING_VERIFICATION={
                    <Flex>
                      <Box mr={20}>
                        <Popup
                          variant="red"
                          buttonText="Відхилити"
                          title="Відхилення декларації"
                        >
                          {toggle => (
                            <Mutation mutation={RejectDeclarationMutation}>
                              {rejectDeclaration => (
                                <Flex justifyContent="center">
                                  <Box mr={20}>
                                    <Button variant="blue" onClick={toggle}>
                                      Повернутися
                                    </Button>
                                  </Box>
                                  <Button
                                    onClick={async () => {
                                      await rejectDeclaration({
                                        variables: {
                                          id
                                        }
                                      });
                                      toggle();
                                    }}
                                    variant="red"
                                  >
                                    Відхилити декларацію
                                  </Button>
                                </Flex>
                              )}
                            </Mutation>
                          )}
                        </Popup>
                      </Box>
                      <Popup
                        variant="green"
                        buttonText="Затвердити"
                        title="Затвердження декларації"
                      >
                        {toggle => (
                          <Mutation mutation={ApproveDeclarationMutation}>
                            {approveDeclaration => (
                              <Flex justifyContent="center">
                                <Box mr={20}>
                                  <Button variant="blue" onClick={toggle}>
                                    Повернутися
                                  </Button>
                                </Box>
                                <Button
                                  onClick={async () => {
                                    await approveDeclaration({
                                      variables: {
                                        id
                                      }
                                    });
                                    toggle();
                                  }}
                                  variant="green"
                                >
                                  Затвердити декларацію
                                </Button>
                              </Flex>
                            )}
                          </Mutation>
                        )}
                      </Popup>
                    </Flex>
                  }
                />
              </Box>
            </Flex>
          </Box>
          <Tabs.Nav>
            <Tabs.NavItem to="./">Загальна інформація</Tabs.NavItem>
            <Tabs.NavItem to="./legal-entity">Медзаклад</Tabs.NavItem>
            <Tabs.NavItem to="./divisions">Відділення</Tabs.NavItem>
            <Tabs.NavItem to="./employee">Лікар</Tabs.NavItem>
            <Tabs.NavItem to="./patient">Пацієнт</Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Box p={5}>
              <Router>
                <GeneralInfo path="/" general={general} />
                <LegalEntity path="/legal-entity" legalEntity={legalEntity} />
                <Division path="/divisions" division={division} />
                <Employee path="/employee" employee={employee} />
                <Patient path="/patient" patient={person} />
              </Router>
            </Box>
          </Tabs.Content>
        </>
      );
    }}
  </Query>
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

const GeneralInfo = ({ general }) => (
  <DefinitionListView
    labels={{
      declarationNumber: "Номер декларації",
      startDate: "Початкова дата дії декларації",
      endDate: "Кінцева дата дії декларації",
      status: "Статус",
      scope: "Тип",
      reason: "Причина розірвання"
    }}
    data={general}
  />
);

const LegalEntity = ({
  legalEntity: { edrpou, publicName, addresses, id }
}) => {
  const [activeAddress] = addresses.filter(a => a.type === "ACTIVE");
  return (
    <>
      <DefinitionListView
        labels={{
          edrpou: "ЄДРПОУ",
          publicName: "Назва",
          addresses: "Адреса"
        }}
        data={{
          edrpou,
          publicName,
          addresses: activeAddress && <AddressView data={activeAddress} />
        }}
      />
      <DefinitionListView
        labels={{
          id: "ID медзакладу",
          link: ""
        }}
        data={{
          id,
          link: (
            <Link to={`/legal-entities/${id}`} fontWeight={700}>
              Показати детальну інформацію
            </Link>
          )
        }}
        color="#7F8FA4"
      />
    </>
  );
};

const Division = ({
  division: { id, addresses, phones, mountainGroup, ...division }
}) => {
  const [activeAddress] = addresses.filter(a => a.type === "ACTIVE");
  return (
    <>
      <DefinitionListView
        labels={{
          name: "Назва",
          addresses: "Адреса",
          mountainGroup: "Гірський регіон",
          phones: "Номер телефону",
          email: "Email"
        }}
        data={{
          addresses: activeAddress && <AddressView data={activeAddress} />,
          phones: getPhones(phones),
          mountainGroup: mountainGroup ? <PositiveIcon /> : null,
          ...division
        }}
      />
      <DefinitionListView
        labels={{
          id: "ID відділення",
          link: ""
        }}
        data={{
          id,
          link: (
            <Link to={`/division/${id}`} fontWeight={700}>
              Показати детальну інформацію
            </Link>
          )
        }}
        color="#7F8FA4"
      />
    </>
  );
};

const Employee = ({
  employee: {
    id,
    position,
    party,
    doctor: { specialities }
  }
}) => {
  const [specialityOfficio] = specialities.filter(s => s.specialityOfficio);
  return (
    <>
      <DefinitionListView
        labels={{
          fullName: "Повне ім’я",
          speciality: "Спеціальність",
          position: "Посада"
        }}
        data={{
          fullName: getFullName(party),
          speciality: specialityOfficio && specialityOfficio.speciality,
          position
        }}
      />
      <DefinitionListView
        labels={{
          id: "ID лікаря",
          link: ""
        }}
        data={{
          id,
          link: (
            <Link to={`/employees/${id}`} fontWeight={700}>
              Показати детальну інформацію
            </Link>
          )
        }}
        color="#7F8FA4"
      />
    </>
  );
};

const Patient = ({
  patient: {
    id,
    birthDate,
    taxId,
    phones,
    birthCountry,
    birthSettlement,
    ...fullName
  }
}) => (
  <>
    <DefinitionListView
      labels={{
        fullName: "Повне ім’я",
        birthDate: "Дата народження",
        birthCountry: "Країна народження",
        birthSettlement: "Місце народження",
        taxId: "ІНН",
        phones: "Номер телефону"
      }}
      data={{
        fullName: getFullName(fullName),
        birthDate,
        birthCountry,
        birthSettlement,
        taxId,
        phones: getPhones(phones)
      }}
    />
    <DefinitionListView
      labels={{
        id: "ID пацієнта",
        link: ""
      }}
      data={{
        id,
        link: (
          <Link to={`/persons/${id}`} fontWeight={700}>
            Показати детальну інформацію
          </Link>
        )
      }}
      color="#7F8FA4"
    />
  </>
);

export default Details;
