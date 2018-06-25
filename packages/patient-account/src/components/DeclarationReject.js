import React from "react";
import { ifProp } from "styled-tools";
import { Mutation } from "react-apollo";
import styled from "react-emotion/macro";

import { Form, Field, Link, Popup } from "@ehealth/components";

import TerminateQuery from "../graphql/TerminateDeclarationQuery.graphql";

const DeclarationReject = ({ onClose, id, onReject }) => (
  <Mutation mutation={TerminateQuery}>
    {terminateDeclaration => {
      return (
        <Popup onClose={onClose}>
          <H2>Розірвання декларації</H2>
          <P red={true}>
            Ви зибраєтесь розірвати декларацію,<br /> цю дію не можна буде
            відмінити.
          </P>
          <P>Ви впевнені, що хочете розірвати декларацію?</P>

          <RejectForm
            onSubmit={async ({ reason }) => {
              try {
                await terminateDeclaration({
                  variables: { id, input: { reason } }
                });
                onClose();
                onReject();
              } catch (error) {
                console.log(error);
              }
            }}
          >
            <Field.MultilineText
              name="reason"
              placeholder="Причина розірвання (опціонально)"
            />

            <Form.Submit size="small">Розірвати декларацію</Form.Submit>
          </RejectForm>

          <Link size="small" onClick={onClose}>
            Повернутися
          </Link>
        </Popup>
      );
    }}
  </Mutation>
);

export default DeclarationReject;

const RejectForm = styled(Form)`
  display: inline-block;
  width: 421px;

  @media (max-width: 753px) {
    width: 90%;
  }
`;

const H2 = styled.h2`
  font-size: 22px;
  color: #292b37;
  text-transform: uppercase;
  margin: 67px 0 46px;
`;
const P = styled.p`
  font-size: 16px;
  line-height: 22px;
  font-weight: 600;
  color: ${ifProp("red", "#fb0327", "#292b37")};
  margin: 30px 0;
`;
