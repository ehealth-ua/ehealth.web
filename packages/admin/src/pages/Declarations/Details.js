import React from "react";
import { Router } from "@reach/router";
import { Query, Mutation } from "react-apollo";
import { Flex, Box, Heading, Text } from "rebass/emotion";
import { BooleanValue } from "react-values";
import system from "system-components/emotion";
import { loader } from "graphql.macro";
import { Trans } from "@lingui/macro";
import {
  PositiveIcon,
  MenuTileIcon,
  MenuListIcon,
  DefaultImageIcon
} from "@ehealth/icons";
import { getFullName, getPhones } from "@ehealth/utils";
import { Form, Modal, Switch } from "@ehealth/components";
import { mixed } from "@ehealth/system-tools";

import Tabs from "../../components/Tabs";
import Link from "../../components/Link";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import LoadingOverlay from "../../components/LoadingOverlay";
import * as Field from "../../components/Field";
import AddressView from "../../components/AddressView";
import Breadcrumbs from "../../components/Breadcrumbs";
import DefinitionListView from "../../components/DefinitionListView";

import STATUSES from "../../helpers/statuses";
import documents from "../../helpers/documents";

const DeclarationQuery = loader("../../graphql/DeclarationQuery.graphql");
const TerminateDeclarationMutation = loader(
  "../../graphql/TerminateDeclarationMutation.graphql"
);
const RejectDeclarationMutation = loader(
  "../../graphql/RejectDeclarationMutation.graphql"
);
const ApproveDeclarationMutation = loader(
  "../../graphql/ApproveDeclarationMutation.graphql"
);

const Details = ({ id }) => (
  <Query query={DeclarationQuery} variables={{ id }}>
    {({ loading, error, data: { declaration = {} } = {} }) => {
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
      } = declaration;

      const general = {
        declarationNumber,
        declarationRequestId,
        startDate,
        endDate,
        status: STATUSES.DECLARATION[status],
        scope,
        reason
      };

      return (
        <LoadingOverlay loading={loading}>
          <Box p={6}>
            <Box mb={10}>
              <Breadcrumbs.List>
                <Breadcrumbs.Item to="/declarations">
                  <Trans>Пошук декларацій</Trans>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Trans>Деталі декларації</Trans>
                </Breadcrumbs.Item>
              </Breadcrumbs.List>
            </Box>
            <Flex justifyContent="space-between" alignItems="flex-end">
              <Box>
                <DefinitionListView
                  labels={{
                    id: "ID декларації",
                    declarationNumber: "Номер декларації",
                    status: "Статус"
                  }}
                  data={{
                    id,
                    declarationNumber,
                    status: (
                      <Badge name={status} type="DECLARATION" minWidth={100} />
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
                              <Trans
                                id="Вкажіть причину розірвання декларації"
                                render={({ translate }) => (
                                  <Field.Textarea
                                    name="reasonDescription"
                                    placeholder={translate}
                                    rows={5}
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
                                  <Trans>Розірвати декларацію</Trans>
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
                          buttonText={<Trans>Відхилити</Trans>}
                          title={<Trans>Відхилення декларації</Trans>}
                        >
                          {toggle => (
                            <Mutation mutation={RejectDeclarationMutation}>
                              {rejectDeclaration => (
                                <Flex justifyContent="center">
                                  <Box mr={20}>
                                    <Button variant="blue" onClick={toggle}>
                                      <Trans>Повернутися</Trans>
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
                                    <Trans>Відхилити декларацію</Trans>
                                  </Button>
                                </Flex>
                              )}
                            </Mutation>
                          )}
                        </Popup>
                      </Box>
                      <Popup
                        variant="green"
                        buttonText={<Trans>Затвердити</Trans>}
                        title={<Trans>Затвердження декларації</Trans>}
                      >
                        {toggle => (
                          <Mutation mutation={ApproveDeclarationMutation}>
                            {approveDeclaration => (
                              <Flex justifyContent="center">
                                <Box mr={20}>
                                  <Button variant="blue" onClick={toggle}>
                                    <Trans>Повернутися</Trans>
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
                                  <Trans>Затвердити декларацію</Trans>
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
            <Tabs.NavItem to="./">
              <Trans>Загальна інформація</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./legal-entity">
              <Trans>Медзаклад</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./divisions">
              <Trans>Відділення</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./employee">
              <Trans>Лікар</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./patient">
              <Trans>Пацієнт</Trans>
            </Tabs.NavItem>
            <Tabs.NavItem to="./documents">
              <Trans>Документи</Trans>
            </Tabs.NavItem>
          </Tabs.Nav>
          <Tabs.Content>
            <Box p={5}>
              <Router>
                <GeneralInfo path="/" general={general} />
                <LegalEntity path="/legal-entity" legalEntity={legalEntity} />
                <Division path="/divisions" division={division} />
                <Employee path="/employee" employee={employee} />
                <Patient path="/patient" patient={person} />
                <Documents path="/documents" documents={documents} />
              </Router>
            </Box>
          </Tabs.Content>
        </LoadingOverlay>
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
      declarationRequestId: <Trans>ID запиту</Trans>,
      startDate: <Trans>Початкова дата дії декларації</Trans>,
      endDate: <Trans>Кінцева дата дії декларації</Trans>,
      status: <Trans>Статус</Trans>,
      scope: <Trans>Тип</Trans>,
      reason: <Trans>Причина розірвання</Trans>
    }}
    data={general}
  />
);

const LegalEntity = ({
  legalEntity: { edrpou, publicName, addresses, id }
}) => {
  const [registrationAddress] = addresses.filter(
    a => a.type === "REGISTRATION"
  );
  return (
    <>
      <DefinitionListView
        labels={{
          edrpou: <Trans>ЄДРПОУ</Trans>,
          publicName: <Trans>Назва</Trans>,
          addresses: <Trans>Адреса</Trans>
        }}
        data={{
          edrpou,
          publicName,
          addresses: registrationAddress && (
            <AddressView data={registrationAddress} />
          )
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
              <Trans>Показати детальну інформацію</Trans>
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
  const [residenceAddress] = addresses.filter(a => a.type === "RESIDENCE");
  return (
    <>
      <DefinitionListView
        labels={{
          name: <Trans>Назва</Trans>,
          type: <Trans>Тип</Trans>,
          addresses: <Trans>Адреса</Trans>,
          mountainGroup: <Trans>Гірський регіон</Trans>,
          phones: <Trans>Номер телефону</Trans>,
          email: "Email"
        }}
        data={{
          addresses: residenceAddress && (
            <AddressView data={residenceAddress} />
          ),
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
              <Trans>Показати детальну інформацію</Trans>
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
          fullName: <Trans>Повне ім’я</Trans>,
          speciality: <Trans>Спеціальність</Trans>,
          position: <Trans>Посада</Trans>
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
              <Trans>Показати детальну інформацію</Trans>
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
    unzr,
    ...fullName
  }
}) => (
  <>
    <DefinitionListView
      labels={{
        fullName: <Trans>Повне ім’я</Trans>,
        birthDate: <Trans>Дата народження</Trans>,
        birthCountry: <Trans>Країна народження</Trans>,
        birthSettlement: <Trans>Місце народження</Trans>,
        unzr: <Trans>ID Запису в ЄДДР</Trans>,
        taxId: <Trans>ІНН</Trans>,
        phones: <Trans>Номер телефону</Trans>
      }}
      data={{
        fullName: getFullName(fullName),
        birthDate,
        birthCountry,
        birthSettlement,
        unzr,
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
            <Trans>Показати детальну інформацію</Trans>
          </Link>
        )
      }}
      color="#7F8FA4"
    />
  </>
);

const Documents = ({ documents }) => (
  <BooleanValue>
    {({ value: opened, toggle }) => (
      <>
        <Flex alignItems="center" justifyContent="flex-end">
          <ButtonIcon pointerEvents={opened} onClick={toggle}>
            <MenuTileIcon />
          </ButtonIcon>
          <ButtonIcon pointerEvents={!opened} onClick={toggle}>
            <MenuListIcon />
          </ButtonIcon>
        </Flex>

        <Flex flexWrap="wrap" flexDirection={!opened ? "column" : "row"}>
          {documents.map(({ src, alt }) => (
            <Box m="2">
              <SaveLink
                href={src}
                target="_blank"
                flexDirection={opened ? "column" : "row"}
                alignItems={!opened ? "center" : "flex-start"}
              >
                {opened ? (
                  <BorderBox>
                    <img src={src} alt={alt} width="100%" height="100%" />
                  </BorderBox>
                ) : (
                  <Box m={1} color="shiningKnight">
                    <DefaultImageIcon />
                  </Box>
                )}
                <Text color="rockmanBlue" lineHeight="1">
                  {alt}
                </Text>
              </SaveLink>
            </Box>
          ))}
        </Flex>
      </>
    )}
  </BooleanValue>
);

const ButtonIcon = system(
  {
    p: 2,
    borderRadius: 2,
    lineHeight: 0
  },
  { cursor: "pointer" },
  props =>
    mixed({
      bg: props.pointerEvents && "silverCity",
      pointerEvents: !props.pointerEvents ? "auto" : "none",
      color: !props.pointerEvents ? "bluePastel" : "shiningKnight"
    })(props)
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

const BorderBox = system({
  border: 1,
  width: 125,
  height: 125,
  m: 2,
  ml: 0,
  borderColor: "silverCity"
});

export default Details;
