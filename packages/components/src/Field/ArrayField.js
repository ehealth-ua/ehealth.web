import React from "react";
import { FieldArray } from "react-final-form-arrays";
import styled from "@emotion/styled";
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
  addButton: AddButton = AddLink,
  removeButton: RemoveButtom = RemoveLink,
  children,
  render = children
}) => (
  <FieldView label={label} horizontal={horizontal} wrapperIsLabel={false}>
    <FieldArray name={name}>
      {({ fields }) => (
        <>
          {fields.map((name, index) => (
            <Item key={name}>
              {render({ name, index, fields })}
              {disableRemove || (
                <RemoveButtom
                  icon={<RemoveIcon />}
                  index={index}
                  onClick={() => fields.remove(index)}
                />
              )}
            </Item>
          ))}
          {disableAdd || (
            <AddButton addText={addText} onClick={() => fields.push()} />
          )}
        </>
      )}
    </FieldArray>
  </FieldView>
);

const AddLink = ({ onClick, addText }) => (
  <Link
    icon={<AddIcon />}
    onClick={onClick}
    size="xs"
    iconReverse
    upperCase
    bold
  >
    {addText}
  </Link>
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
