import React from "react";
import { Query } from "react-apollo";
import { Heading, Link, Spinner } from "@ehealth/components";
import { PencilIcon } from "@ehealth/icons";
import {
  getDefinitions,
  getFullName,
  formatDate,
  formatPhone
} from "@ehealth/utils";
import { Flex } from "@rebass/emotion";
import { loader } from "graphql.macro";

import Section from "../components/Section";
import DefinitionListView from "../components/DefinitionListView";
import DictionaryValue from "../components/DictionaryValue";
import AddressView from "../components/AddressView";
import ProfileAuthSection from "../components/ProfileAuthSection";

const PersonDetailsQuery = loader("../graphql/PersonDetailsQuery.graphql");

const ProfilePage = () => (
  <>
    <Heading.H1>Мій профіль</Heading.H1>
    <Flex justifyContent="space-between" alignItems="baseline">
      <Heading.H3 weight="bold">Персональні дані</Heading.H3>
      <Link
        to="/profile/edit"
        size="xs"
        upperCase
        icon={<PencilIcon height="14" />}
        iconReverse
        bold
      >
        Редагувати профіль
      </Link>
    </Flex>
    <Query query={PersonDetailsQuery}>
      {({ loading, error, data: { person } }) => {
        if (loading || error) return <Spinner />;

        const documents = getDefinitions({
          data: person.data.documents,
          keyExtractor: ({ type }) => `documents.${type}`,
          renderLabel: ({ type }) => (
            <DictionaryValue name="DOCUMENT_TYPE" item={type} />
          ),
          renderItem: item => <DocumentItem data={item} />
        });

        const addresses = getDefinitions({
          data: person.data.addresses,
          keyExtractor: ({ type }) => `addresses.${type}`,
          renderLabel: ({ type }) => (
            <>
              Адреса <DictionaryValue name="ADDRESS_TYPE" item={type} />
            </>
          ),
          renderItem: item => <AddressView data={item} />
        });

        const emergencyContactPhones = getDefinitions({
          data: person.data.emergencyContact.phones,
          keyExtractor: ({ type }) => `phones.${type}`,
          renderLabel: () => "Номер телефону",
          renderItem: ({ number }) => formatPhone(number)
        });

        return (
          <>
            <Section>
              <DefinitionListView
                labels={{
                  name: "ПІБ",
                  birthDate: "Дата народження",
                  birthCountry: "Країна народження",
                  birthSettlement: "Місто народження",
                  gender: "Стать"
                }}
                data={{
                  ...person.data,
                  name: getFullName(person.data),
                  birthDate: formatDate(person.data.birthDate),
                  gender: (
                    <DictionaryValue name="GENDER" item={person.data.gender} />
                  )
                }}
              />
            </Section>
            <Section>
              <DefinitionListView
                labels={{ taxId: "ІПН", ...documents.labels }}
                data={{ ...person.data, ...documents.items }}
              />
            </Section>
            <Section>
              <DefinitionListView
                labels={{
                  ...addresses.labels,
                  preferredWayCommunication: "Бажаний метод зв’язку",
                  secret: "Слово-пароль"
                }}
                data={{ ...person.data, ...addresses.items }}
              />
            </Section>
            <Section>
              <Heading.H3 weight="bold">
                Контактна особа у екстреному випадку
              </Heading.H3>
              <DefinitionListView
                labels={{
                  name: "ПІБ",
                  ...emergencyContactPhones.labels
                }}
                data={{
                  name: getFullName(person.data.emergencyContact),
                  ...emergencyContactPhones.items
                }}
              />
            </Section>
            <ProfileAuthSection data={person.data} />
          </>
        );
      }}
    </Query>
  </>
);

export default ProfilePage;

const DocumentItem = ({ data: { number, issuedBy, issuedAt } }) => (
  <>
    {number}
    {issuedBy && (
      <>
        <br />
        виданий {issuedBy} {issuedAt && formatDate(issuedAt)}
      </>
    )}
  </>
);
