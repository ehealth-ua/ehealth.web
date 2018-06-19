import React from "react";
import { FieldArray } from "react-final-form-arrays";
import styled from "react-emotion/macro";
import { AddIcon, RemoveIcon } from "@ehealth/icons";

import Link from "../Link";
import FieldView from "./FieldView";

const ArrayField = ({
  label,
  horizontal,
  name,
  addText,
  disableAdd,
  disableRemove,
  children,
  render = children
}) => (
  <FieldView label={label} horizontal={horizontal} wrapperIsLabel={false}>
    <FieldArray name={name}>
      {({ fields }) => (
        <>
          {fields.map((name, index) => (
            <Item key={name}>
              {render({ name, index })}
              {disableRemove || (
                <RemoveLink
                  icon={<RemoveIcon />}
                  onClick={() => fields.remove(index)}
                />
              )}
            </Item>
          ))}
          {disableAdd || (
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
          )}
        </>
      )}
    </FieldArray>
  </FieldView>
);

export default ArrayField;

const Item = styled.div`
  position: relative;
`;

const RemoveLink = styled(Link)`
  position: absolute;
  top: 0;
  left: 100%;
`;
