import React from "react";
import { Link } from "react-router";
import Composer from "react-composer";
import { formatPhone, parsePhone } from "@ehealth/utils";
import { Field, Form, Validation, Validations } from "@ehealth/components";
import DigitalSignature from "@ehealth/react-iit-digital-signature";

import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";

const NAME_PATTERN =
  '^(?!.*[ЫЪЭЁыъэё@%&$^#])[a-zA-ZА-ЯҐЇІЄа-яґїіє0-9№\\"!\\^\\*)\\]\\[(._-].*$';
const PERSON_NAME_PATTERN = "^(?!.*[ЫЪЭЁыъэё@%&$^#])[А-ЯҐЇІЄа-яґїіє\\'\\- ]*$";
const PHONE_PATTERN = "^\\+380\\d{9}$";

const SignUpUserPage = ({ location, router }) => (
  <Main>
    <Header>
      <H1>Авторизація в системі</H1>
    </Header>
    <Article>
      <UserInfo />
      <NarrowContainer>
        <Field.Input name="person.email" disabled />
        <Field.Password name="password" placeholder="пароль" />
        <Validations field="password">
          <Validation.Required message="Об'язкове поле" />
          <Validation.Length
            options={{ min: 12 }}
            message="Не менше 12 символів"
          />
          <Validation.Matches
            options={/^(?=.*[a-zа-яёїієґ])(?=.*[A-ZА-ЯЁЇIЄҐ])(?=.*\d)/}
            message="Пароль повинен містити великі, малі літери та цифри"
          />
          <Validation.Submit
            rule="password_used"
            message="Пароль був використаний у системі раніше"
          />
        </Validations>
        <Field.Password
          name="confirm_password"
          placeholder="повторити пароль"
        />
        <Validations field="confirm_password">
          <Validation.Required message="Об'язкове поле" />
          <Validation.Length
            options={{ min: 12 }}
            message="Не менше 12 символів"
          />
          <Validation.Matches
            options={/^(?=.*[a-zа-яёїієґ])(?=.*[A-ZА-ЯЁЇIЄҐ])(?=.*\d)/}
            message="Пароль повинен містити великі, малі літери та цифри"
          />
          <Validation
            validate={(value, { password } = {}) => value === password}
            message="Паролі повинні співпадати"
          />
        </Validations>
        <Field.Group label="Контактна особа для екстреного зв'язку">
          <Field.Input
            name="person.emergency_contact.first_name"
            placeholder="Ім'я"
          />
          <Validations field="person.emergency_contact.first_name">
            <Validation.Required message="Об'язкове поле" />
            <Validation.Matches
              options={PERSON_NAME_PATTERN}
              message="Дозволені тільки літери українського алфавіту"
            />
          </Validations>
          <Field.Input
            name="person.emergency_contact.last_name"
            placeholder="Прізвище"
          />
          <Validations field="person.emergency_contact.last_name">
            <Validation.Required message="Об'язкове поле" />
            <Validation.Matches
              options={PERSON_NAME_PATTERN}
              message="Дозволені тільки літери українського алфавіту"
            />
          </Validations>
          <Field.Input
            name="person.emergency_contact.second_name"
            placeholder="По-батькові"
          />
          <Validation.Matches
            field="person.emergency_contact.second_name"
            options={PERSON_NAME_PATTERN}
            message="Дозволені тільки літери українського алфавіту"
          />
          <Field.Input
            name="person.emergency_contact.phones[0].number"
            label="Номер телефону контактної особи"
            format={formatPhone}
            parse={parsePhone}
          />
          <Validations field="person.emergency_contact.phones[0].number">
            <Validation.Required message="Об'язкове поле" />
            <Validation.Matches
              options={PHONE_PATTERN}
              message="Невірний номер телефону"
            />
          </Validations>
        </Field.Group>
        <Field.Group label="Бажаний метод зв'язку">
          <Field.Row>
            <Field.Col width={1 / 3}>
              <Field.Radio
                name="person.preferred_way_communication"
                label="Телефон"
                value="phone"
              />
            </Field.Col>
            <Field.Col width={1 / 3}>
              <Field.Radio
                name="person.preferred_way_communication"
                label="Email"
                value="email"
              />
            </Field.Col>
          </Field.Row>
        </Field.Group>
        <Field.Input name="person.secret" placeholder="Слово-пароль" />
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
        <Field.Input
          name="person.authentication_methods[0].phone_number"
          label="Авторизаційний номер телефону"
          format={formatPhone}
          parse={parsePhone}
        />
        <Validations field="person.authentication_methods[0].phone_number">
          <Validation.Required message="Об'язкове поле" />
          <Validation.Matches
            options={PHONE_PATTERN}
            message="Невірний номер телефону"
          />
        </Validations>
        <Field.Checkbox
          label="Співпадає з контактним номером телефону"
          name="local.contactPhoneMatchesAuth"
        />
        <Field
          name="local.contactPhoneMatchesAuth"
          subscription={{ value: true }}
        >
          {({ input: { value: phone } }) =>
            phone || (
              <>
                <Field.Input
                  name="local.contactPhoneNumber"
                  label="Контактний номер телефону"
                  format={formatPhone}
                  parse={parsePhone}
                />
                <Validations field="local.contactPhoneNumber">
                  <Validation.Required message="Об'язкове поле" />
                  <Validation.Matches
                    options={PHONE_PATTERN}
                    message="Невірний номер телефону"
                  />
                </Validations>
              </>
            )
          }
        </Field>
        <Field.Checkbox
          label="Даю згоду на обробку персональних даних"
          name="person.process_disclosure_data_consent"
        />
        <Field
          name="person.process_disclosure_data_consent"
          subscription={{ value: true }}
        >
          {({ input: { value: consent } }) => (
            <Form.Submit disabled={!consent} block>
              Далі
            </Form.Submit>
          )}
        </Field>
        <Link to={{ ...location, pathname: "/sign-up/person" }}>Назад</Link>
      </NarrowContainer>
    </Article>
  </Main>
);

export default SignUpUserPage;

const UserInfo = () => (
  <Composer
    components={[
      <Field name="person.second_name" subscription={{ value: true }} />,
      <Field name="person.first_name" subscription={{ value: true }} />,
      <Field name="person.last_name" subscription={{ value: true }} />,
      <Field name="person.email" subscription={{ value: true }} />,
      <DigitalSignature.Consumer />
    ]}
  >
    {([
      {
        input: { value: secondName }
      },
      {
        input: { value: firstName }
      },
      {
        input: { value: lastName }
      },
      {
        input: { value: email }
      },
      {
        ds: { privKeyOwnerInfo }
      }
    ]) => (
      <p>
        {secondName} {firstName} {lastName}
        <br />
        {email}
        <br />
        ІПН: {privKeyOwnerInfo.subjDRFOCode}
      </p>
    )}
  </Composer>
);
