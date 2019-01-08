import React from "react";
import styled from "@emotion/styled";

import DigitalSignature from "@ehealth/react-iit-digital-signature";
import { Field, Form, Validation } from "@ehealth/components";
import { StampIcon } from "@ehealth/icons";

const DigitalStampForm = ({ onSubmit }) => (
  <DigitalSignature.Consumer>
    {({ ds, readPrivateKey }) => (
      <Form
        onSubmit={async ({
          authorityIndex,
          privateStampFile,
          privateStampPassword
        }) => {
          try {
            ds.setAuthority(authorityIndex);
            await readPrivateKey(privateStampFile, privateStampPassword);
            onSubmit(ds);
          } catch (err) {
            return { privateStampFile: err.message };
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
          renderItem={({ issuerCNs: [name] }) => name}
        />
        <Validation.Required field="authorityIndex" message="Об'язкове поле" />

        <Field.File
          name="privateStampFile"
          placeholder="Файл із закритим ключем"
          icon={
            <WrapperIcon>
              <StampIcon width="27" height="29" />
            </WrapperIcon>
          }
        />
        <Validation.Required
          field="privateStampFile"
          message="Об'язкове поле"
        />
        <Field.Password
          name="privateStampPassword"
          placeholder="Пароль до закритого ключа"
          autoComplete="new-password"
        />
        <Validation.Required
          field="privateStampPassword"
          message="Об'язкове поле"
        />

        <Form.Submit block>Готово</Form.Submit>
      </Form>
    )}
  </DigitalSignature.Consumer>
);

const WrapperIcon = styled.div`
  margin: -7px;
`;

export default DigitalStampForm;
