import React from "react";
import { ifProp } from "styled-tools";
import { Mutation } from "react-apollo";
import styled from "@emotion/styled";
import { loader } from "graphql.macro";

import { Form, Field, Link, Modal, Heading } from "@ehealth/components";

const TerminateDeclarationQuery = loader(
  "../graphql/TerminateDeclarationQuery.graphql"
);

const DeclarationReject = ({ onClose, id, onReject }) => (
  <Mutation mutation={TerminateDeclarationQuery}>
    {terminateDeclaration => {
      return (
        <Modal width={760} onClose={onClose} backdrop>
          <Heading.H1>Розірвання декларації</Heading.H1>
          <P red={true}>
            Ви збираєтесь розірвати декларацію,
            <br />
            цю дію не можна буде відмінити.
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
              rows="3"
              noResize={true}
            />

            <Form.Submit size="small">Розірвати декларацію</Form.Submit>
          </RejectForm>

          <Link size="small" onClick={onClose}>
            Повернутися
          </Link>
        </Modal>
      );
    }}
  </Mutation>
);

export default DeclarationReject;

const RejectForm = styled(Form)`
  display: block;
  width: 421px;
  margin: 0 auto;

  @media (max-width: 753px) {
    width: 90%;
  }
`;

const P = styled.p`
  font-size: 16px;
  line-height: 22px;
  font-weight: 600;
  color: ${ifProp("red", "#fb0327", "#292b37")};
  margin: 30px 0;
`;
