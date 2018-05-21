import React from "react";
import Field from "./index";
import styled from "react-emotion/macro";
import AddIcon from "@ehealth/icons/src/AddIcon";
import RemoveIcon from "@ehealth/icons/src/RemoveIcon";

import { FieldArray } from "react-final-form-arrays";

const ArrayForm = ({
  addText,
  addIcon = AddIcon,
  removeIcon = RemoveIcon,
  children,
  render = children
}) => (
  <Field>
    {() => (
      <FieldArray name="additionalFields">
        {({ fields }) => {
          return (
            <>
              {fields.map((name, index) => (
                <Container key={index}>
                  {render({ name, index })}
                  <DrawButton
                    fields={fields}
                    Icon={removeIcon}
                    action={() => fields.remove(index)}
                  />
                </Container>
              ))}
              <DrawButton fields={fields} Icon={addIcon} action={fields.push}>
                {addText}
              </DrawButton>
            </>
          );
        }}
      </FieldArray>
    )}
  </Field>
);

export default ArrayForm;

const DrawButton = ({ children, fields, Icon, action }) => (
  <Button type="button" onClick={() => action()}>
    <Icon />
    {children ? <ButtonSpan>{children}</ButtonSpan> : null}
  </Button>
);

export const Button = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #187de1;
`;

export const ButtonSpan = styled.span`
  margin: 0 10px;
`;

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #e6e6e8;
  padding: 15px 0 0;
  margin-bottom: 10px;
`;
