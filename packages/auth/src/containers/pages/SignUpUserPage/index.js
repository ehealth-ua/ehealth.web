import React, { Component } from "react";
import { Flex, Box } from "grid-emotion";
import { connect } from "react-redux";
import debounce from "lodash/debounce";
import { formatPhone, parsePhone } from "@ehealth/utils";

import { createUrl } from "../../../helpers/url";

import { Field, Form, Validation, Button } from "@ehealth/components";

const UserFields = () => (
  <>
    <Field.Input name="email" placeholder="dima@nebo15.com" disabled />
    <Field.Password
      name="password"
      placeholder="пароль (не мерше 6 символів)"
    />
    <Field.Input
      name="emergency_contact.first_name"
      placeholder="Введіть ім'я"
      label="Контактна особа у разі екстренного зв'язку"
    />
    <Field.Input
      name="emergency_contact.second_name"
      placeholder="Введіть прізвище"
    />
    <Field.Input
      name="emergency_contact.last_name"
      placeholder="Введіть по-батькові"
    />
    <Field name="emergency_contact.phones.type">
      {({ input: { onChange, value } }) => (onChange("MOBILE"), null)}
    </Field>
    <Field.Input
      name="emergency_contact.phones.number"
      label="Номер телефону контактної особи"
      format={formatPhone}
      parse={parsePhone}
    />
    <Field.Group label="Бажаний метод зв'язку">
      <Flex my={10}>
        <Box width={1 / 3}>
          <Field.Radio
            name="preferred_way_communication"
            label="Телефон"
            value="phone"
          />
        </Box>
        <Box width={1 / 3}>
          <Field.Radio
            name="preferred_way_communication"
            label="Email"
            value="email"
          />
        </Box>
      </Flex>
    </Field.Group>
    <Field.Input name="secret" placeholder="Слово-пароль" />
    <Field.Input
      name="authentication_methods.phone_number"
      label="Авторизаційний номер телефону"
      format={formatPhone}
      parse={parsePhone}
    />
    <Field.Checkbox
      label="Співпадає з контактним номером телефону"
      name="authPhoneMatchesEmergencyContact"
    />
    <Field
      name="authPhoneMatchesEmergencyContact"
      subscription={{ value: true }}
    >
      {({ input: { value: phone } }) =>
        phone || (
          <>
            <Field name="phones[0].type">
              {({ input: { onChange } }) => (onChange("MOBILE"), null)}
            </Field>
            <Field.Input
              name="phones[0].number"
              label="Контактний номер телефону"
              format={formatPhone}
              parse={parsePhone}
            />
          </>
        )
      }
    </Field>
    <Field.Checkbox
      label="Даю згоду на обробку персональних даних"
      name="agree"
    />
  </>
);

export default UserFields;
