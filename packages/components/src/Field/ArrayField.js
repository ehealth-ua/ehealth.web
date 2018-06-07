import React, { Fragment } from "react";
import styled from "react-emotion/macro";
import { FieldArray } from "react-final-form-arrays";
import { AddIcon, RemoveIcon } from "@ehealth/icons";

import Field from "./index";
import Link from "../Link";

const ArrayForm = ({ name, addText, children, render = children }) => (
  <Field>
    {() => (
      <FieldArray name={name}>
        {({ fields }) => (
          <>
            {fields.map((name, index) => (
              <Container key={name}>
                <Content>{render({ name, index })}</Content>
                <Link
                  icon={<RemoveIcon />}
                  onClick={() => fields.remove(index)}
                />
              </Container>
            ))}
            <Link
              icon={<AddIcon />}
              onClick={() => fields.push()}
              size="xs"
              iconReverse
              upperCase
              bold
            >
              {addText}
            </Link>
          </>
        )}
      </FieldArray>
    )}
  </Field>
);

export default ArrayForm;

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 15px 0 0;
  margin-bottom: 10px;
`;

const Content = styled.div`
  flex: 1 1 auto;
`;
