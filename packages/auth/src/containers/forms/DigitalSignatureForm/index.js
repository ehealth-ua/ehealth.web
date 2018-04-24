import React from "react";
import DigitalSignature from "@ehealth/react-iit-digital-signature";
import { Field, Form, Validation, Validations } from "@ehealth/components";
import { KeyIcon } from "@ehealth/icons";

const DigitalSignatureForm = ({ onSubmit }) => (
  <DigitalSignature.Consumer>
    {({ ds, readPrivateKey }) => (
      <Form
        onSubmit={async ({
          authorityIndex,
          privateKeyFile,
          privateKeyPassword
        }) => {
          try {
            ds.setAuthority(authorityIndex);
            await readPrivateKey(privateKeyFile, privateKeyPassword);
            onSubmit(ds);
          } catch (err) {
            return { privateKeyFile: err.message };
          }
        }}
      >
        <Field.Select
          name="authorityIndex"
          placeholder="Оберіть АЦСК"
          items={ds.authorities}
          format={value => ds.authorities[value] || null}
          parse={item =>
            item == null ? undefined : ds.authorities.indexOf(item)
          }
          itemToString={item => (item == null ? "" : item.issuerCNs[0])}
          filterItems={(inputValue, { issuerCNs: [name] }) =>
            name.toLowerCase().includes(inputValue.toLowerCase())
          }
          renderItem={({ issuerCNs: [name] }) => name}
        />
        <Validation.Required field="authorityIndex" message="Об'язкове поле" />
        <Field.File
          name="privateKeyFile"
          placeholder="Файл із закритим ключем"
          icon={<KeyIcon width="13" height="28" />}
        />
        <Validation.Required field="privateKeyFile" message="Об'язкове поле" />
        <Field.Password
          name="privateKeyPassword"
          placeholder="Пароль до закритого ключа"
          autoComplete="new-password"
        />
        <Validation.Required
          field="privateKeyPassword"
          message="Об'язкове поле"
        />
        <Form.Submit block>Далі</Form.Submit>
      </Form>
    )}
  </DigitalSignature.Consumer>
);

export default DigitalSignatureForm;
