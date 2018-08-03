import React from "react";
import { Query, Mutation } from "react-apollo";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
import { Signer } from "@ehealth/react-iit-digital-signature";
import { Flex } from "rebass/emotion";
import {
  Heading,
  Link,
  Form,
  Field,
  Validation,
  Validations,
  SUBMIT_ERROR
} from "@ehealth/components";
import { PencilIcon } from "@ehealth/icons";
import {
  convertObjectKeys,
  getFullName,
  fieldNameDenormalizer,
  formatDate,
  parseDate,
  formatPhone,
  parsePhone
} from "@ehealth/utils";

import { REACT_APP_SIGNER_URL } from "../env";
import PersonDetailsQuery from "../graphql/PersonDetailsQuery.graphql";
import RegionsQuery from "../graphql/RegionsQuery.graphql";
import SearchSettlementsQuery from "../graphql/SearchSettlementsQuery.graphql";
import UpdatePersonMutation from "../graphql/UpdatePersonMutation.graphql";
import Section from "../components/Section";
import DefinitionListView from "../components/DefinitionListView";
import DictionaryValue from "../components/DictionaryValue";
import ProfileAuthSection from "../components/ProfileAuthSection";

const NAME_PATTERN =
  '^(?!.*[ЫЪЭЁыъэё@%&$^#])[a-zA-ZА-ЯҐЇІЄа-яґїіє0-9№\\"!\\^\\*)\\]\\[(._-].*$';
const BUILDING_PATTERN =
  "^[1-9]((?![ЫЪЭЁыъэё])()([А-ЯҐЇІЄа-яґїіє \\/\\'\\-0-9])){0,20}$";
const PHONE_PATTERN = "^\\+380\\d{9}$";
const PERSON_NAME_PATTERN = "^(?!.*[ЫЪЭЁыъэё@%&$^#])[А-ЯҐЇІЄа-яґїіє\\'\\- ]*$";

const ProfileEditPage = ({ history }) => (
  <>
    <Heading.H1>Мій профіль</Heading.H1>

    <Query query={PersonDetailsQuery}>
      {({ loading, error, data: { person } }) =>
        !(loading || error) && (
          <Signer.Parent
            url={REACT_APP_SIGNER_URL}
            features={{ width: 640, height: 589 }}
          >
            {({ signData }) => (
              <Mutation mutation={UpdatePersonMutation}>
                {updatePerson => (
                  <Form
                    initialValues={parsePersonDetails(person.data)}
                    onSubmit={async fields => {
                      try {
                        const { id, ...person } = convertObjectKeys(
                          formatPersonDetails(fields),
                          fieldNameDenormalizer
                        );

                        const { signedContent, meta } = await signData(person);

                        const variables = {
                          id,
                          input: {
                            signedContent,
                            signedContentEncoding: "base64"
                          }
                        };

                        const context = {
                          headers: meta
                        };

                        await updatePerson({ variables, context });
                        history.push("/profile");
                      } catch ({ networkError }) {
                        return {
                          [SUBMIT_ERROR]: networkError.result.error.invalid
                        };
                      }
                    }}
                  >
                    <Section>
                      <Flex
                        justifyContent="space-between"
                        alignItems="baseline"
                      >
                        <Heading.H3 weight="bold">Персональні дані</Heading.H3>
                        <Link
                          to="/profile"
                          size="xs"
                          upperCase
                          bold
                          icon={<PencilIcon height="14" />}
                          iconReverse
                        >
                          Вийти з режиму редагування
                        </Link>
                      </Flex>
                      <DefinitionListView
                        labels={{
                          name: "ПІБ",
                          birthDate: "Дата народження",
                          birthCountry: "Країна народження",
                          birthSettlement: "Місто народження",
                          gender: "Стать",
                          taxId: "ІПН"
                        }}
                        data={{
                          ...person.data,
                          name: getFullName(person.data),
                          birthDate: formatDate(person.data.birthDate),
                          gender: (
                            <DictionaryValue
                              name="GENDER"
                              item={person.data.gender}
                            />
                          )
                        }}
                      />
                    </Section>
                    <Section>
                      <Field.Array
                        name="person.documents"
                        disableAdd
                        disableRemove
                      >
                        {({ name }) => <DocumentFields name={name} />}
                      </Field.Array>
                    </Section>
                    <Section>
                      <Field.Group label="Адреса реєстрації" horizontal>
                        <AddressFields name="person.addresses.REGISTRATION" />
                      </Field.Group>
                      <Field.Group label="Адреса проживання" horizontal>
                        <Field.Checkbox
                          label="Співпадає з місцем реєстрації"
                          name="meta.residenceAddressMatchesRegistration"
                        />
                        <Field
                          name="meta.residenceAddressMatchesRegistration"
                          subscription={{ value: true }}
                        >
                          {({ input: { value } }) =>
                            value || (
                              <AddressFields name="person.addresses.RESIDENCE" />
                            )
                          }
                        </Field>
                      </Field.Group>
                      <Field.Group label="Бажаний метод зв'язку" horizontal>
                        <Field.Row>
                          <Field.Col width={1 / 3}>
                            <Field.Radio
                              name="person.preferredWayCommunication"
                              label="Телефон"
                              value="phone"
                            />
                          </Field.Col>
                          <Field.Col width={1 / 3}>
                            <Field.Radio
                              name="person.preferredWayCommunication"
                              label="Email"
                              value="email"
                            />
                          </Field.Col>
                        </Field.Row>
                      </Field.Group>
                      <Field.Array
                        name="person.phones"
                        disableAdd
                        disableRemove
                      >
                        {({ name, index }) => <PhoneFields name={name} />}
                      </Field.Array>
                      <Field.Text
                        name="person.secret"
                        label="Слово-пароль"
                        horizontal
                      />
                      <Validations field="person.secret">
                        <Validation.Required message="Об'язкове поле" />
                        <Validation.Matches
                          options={NAME_PATTERN}
                          message="Дозволені тільки цифри та літери українського й англійського алфавіту"
                        />
                        <Validation.Length
                          options={{ min: 6 }}
                          message="Не менше 6 символів"
                        />
                      </Validations>
                    </Section>
                    <Section>
                      <Heading.H3 weight="bold">
                        Контактна особа у екстреному випадку
                      </Heading.H3>
                      <Field.Group label="ПІБ" horizontal>
                        <Field.Text
                          name="person.emergencyContact.firstName"
                          placeholder="Введіть ім'я"
                        />
                        <Validations field="person.emergencyContact.firstName">
                          <Validation.Required message="Об'язкове поле" />
                          <Validation.Matches
                            options={PERSON_NAME_PATTERN}
                            message="Дозволені тільки літери українського алфавіту"
                          />
                        </Validations>
                        <Field.Text
                          name="person.emergencyContact.lastName"
                          placeholder="Введіть прізвище"
                        />
                        <Validations field="person.emergencyContact.lastName">
                          <Validation.Required message="Об'язкове поле" />
                          <Validation.Matches
                            options={PERSON_NAME_PATTERN}
                            message="Дозволені тільки літери українського алфавіту"
                          />
                        </Validations>
                        <Field.Text
                          name="person.emergencyContact.secondName"
                          placeholder="Введіть по-батькові"
                        />
                        <Validation.Matches
                          field="person.emergencyContact.secondName"
                          options={PERSON_NAME_PATTERN}
                          message="Дозволені тільки літери українського алфавіту"
                        />
                      </Field.Group>
                      <Field.Array
                        name="person.emergencyContact.phones"
                        disableAdd
                        disableRemove
                      >
                        {({ name, index }) => <PhoneFields name={name} />}
                      </Field.Array>
                    </Section>
                    <ProfileAuthSection data={person.data} />
                    <Form.Error
                      entry="$.data"
                      invalid="Підписання інформації має здійснюватись за домопогою власного цифрового підпису."
                      default="Щось пішло не так. Спробуйте пізніше"
                    />
                    <Flex justifyContent="space-around" alignItems="baseline">
                      <Link to="/profile" size="small" upperCase bold spaced>
                        Вийти з режиму редагування
                      </Link>{" "}
                      <Form.Submit size="small">Зберегти зміни</Form.Submit>
                    </Flex>
                  </Form>
                )}
              </Mutation>
            )}
          </Signer.Parent>
        )
      }
    </Query>
  </>
);

export default ProfileEditPage;

const DocumentFields = ({ name }) => (
  <Field.Group
    label={
      <Field name={`${name}.type`} subscription={{ value: true }}>
        {({ input: { value: type } }) => (
          <DictionaryValue name="DOCUMENT_TYPE" item={type} />
        )}
      </Field>
    }
    horizontal
  >
    <Field.Text name={`${name}.number`} placeholder="Серія і номер" />
    <Validation.Required field={`${name}.number`} message="Об'язкове поле" />
    <Field.Text name={`${name}.issuedBy`} placeholder="Ким виданий" />
    <Field.Input
      name={`${name}.issuedAt`}
      placeholder="Дата видачі"
      format={formatDate}
      parse={parseDate}
    />
    <Validation.Date field={`${name}.issuedAt`} message="Невірна дата" />
  </Field.Group>
);

const AddressFields = ({ name }) => (
  <>
    <Query query={RegionsQuery} context={{ credentials: "same-origin" }}>
      {({ loading, error, data: { regions } = {} }) =>
        !(loading || error) && (
          <Field.Select
            name={`${name}.area`}
            placeholder="Область"
            items={regions.data
              .map(({ name }) => name)
              .sort((a, b) =>
                a.replace(/м\./i, "").localeCompare(b.replace(/м\./i, ""))
              )}
            filterItems={(inputValue, item) =>
              item.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
        )
      }
    </Query>
    <Validation.Required field={`${name}.area`} message="Об'язкове поле" />
    <Field name={`${name}.area`} subscription={{ value: true }}>
      {({ input: { value: region } }) => (
        <Query
          query={SearchSettlementsQuery}
          variables={{ region, name: "", pageSize: 50 }}
          context={{ credentials: "same-origin" }}
          skip={!region}
        >
          {({ loading, error, data: { settlements } = {}, refetch }) => (
            <Field.Select
              name={`${name}.settlement`}
              disabled={!region}
              placeholder="Назва населеного пункту"
              itemToString={item => (item === null ? "" : item.name)}
              items={loading || error ? [] : settlements.data}
              onInputValueChange={debounce(name => refetch({ name }), 500)}
              renderItem={({ type, name, district }) => (
                <>
                  <small>
                    <DictionaryValue name="SETTLEMENT_TYPE" item={type} />
                  </small>{" "}
                  {name}
                  {district && (
                    <>
                      {", "}
                      <small>{district} район</small>
                    </>
                  )}
                </>
              )}
            />
          )}
        </Query>
      )}
    </Field>
    <Validation.Required
      field={`${name}.settlement`}
      message="Об'язкове поле"
    />
    <Field.Text name={`${name}.zip`} placeholder="Індекс" />
    <Validations field={`${name}.zip`}>
      <Validation.Matches options={/^\d*$/} message="Дозволені тільки цифри" />
      <Validation.Length
        options={{ min: 5, max: 5 }}
        message="Довжина становить 5 символів"
      />
    </Validations>
    <Field.Row mx={-2}>
      <Field.Col width={1 / 2}>
        <DictionaryValue name="STREET_TYPE">
          {dict => (
            <Field.Select
              name={`${name}.streetType`}
              placeholder="Тип вулиці"
              itemToString={item => (item == null ? "" : dict[item])}
              items={Object.keys(dict)}
              renderItem={item => dict[item]}
            />
          )}
        </DictionaryValue>
      </Field.Col>
      <Field.Col width={1 / 2}>
        <Field.Input name={`${name}.street`} placeholder="Назва вулиці" />
        <Validation.Matches
          field={`${name}.street`}
          options={NAME_PATTERN}
          message="Дозволені тільки цифри та літери українського й англійського алфавіту"
        />
      </Field.Col>
    </Field.Row>
    <Field.Row>
      <Field.Col width={1 / 3}>
        <Field.Input name={`${name}.building`} placeholder="№ буд." />
        <Validations field={`${name}.building`}>
          <Validation.Required message="Об'язкове поле" />
          <Validation.Matches
            options={BUILDING_PATTERN}
            message="Невірний формат"
          />
        </Validations>
      </Field.Col>
      <Field.Col width={1 / 3}>
        <Field.Input name={`${name}.apartment`} placeholder="№ квартири" />
      </Field.Col>
    </Field.Row>
  </>
);

const PhoneFields = ({ name }) => (
  <>
    <Field.Text
      name={`${name}.number`}
      label="Номер телефону"
      format={formatPhone}
      parse={parsePhone}
      horizontal
    />
    <Validations field={`${name}.number`}>
      <Validation.Required message="Об'язкове поле" />
      <Validation.Matches
        options={PHONE_PATTERN}
        message="Невірний номер телефону"
      />
    </Validations>
  </>
);

const parsePersonDetails = data => {
  const { addresses, ...personData } = data;

  const person = {
    addresses: parseAddresses(addresses),
    ...personData
  };

  const meta = collectMetadata(person);

  return { meta, person };
};

const parseAddresses = addresses =>
  addresses.reduce(
    (addresses, { type, ...address }) => ({
      ...addresses,
      [type]: parseSettlement(address)
    }),
    {}
  );

const parseSettlement = ({
  settlement,
  settlementId,
  settlementType,
  ...address
}) => ({
  settlement: {
    id: settlementId,
    type: settlementType,
    name: settlement
  },
  ...address
});

const collectMetadata = ({ addresses }) => {
  const residenceAddressMatchesRegistration = isEqual(
    addresses.REGISTRATION,
    addresses.RESIDENCE
  );

  return {
    residenceAddressMatchesRegistration
  };
};

const formatPersonDetails = ({ meta, person }) => {
  const { addresses, ...personValues } = person;

  if (meta.residenceAddressMatchesRegistration) {
    addresses.RESIDENCE = addresses.REGISTRATION;
  }

  return { addresses: formatAddresses(addresses), ...personValues };
};

const formatAddresses = addresses =>
  Object.entries(addresses).map(([type, address]) => ({
    type,
    country: "УКРАЇНА",
    ...formatSettlement(address)
  }));

const formatSettlement = ({ settlement, ...address }) => ({
  settlementId: settlement.id,
  settlementType: settlement.type,
  settlement: settlement.name,
  ...address
});
