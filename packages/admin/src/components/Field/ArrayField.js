import React from "react";
import { Flex, Box } from "@rebass/emotion";
import { Field } from "@ehealth/components";
import system from "@ehealth/system-components";
import { DropDownButton as PlusIcon } from "@ehealth/icons";

import Button from "../../components/Button";

const ArrayField = ({
  name,
  addText,
  removeText,
  withDelimiter,
  customRemoveButton,
  removeButton: RemoveButton = DefaultRemoveButton,
  fields: Fields,
  headerComponent: Header,
  firstItemPinned,
  vertical
}) => (
  <Field.Array
    name={name}
    addText={addText}
    addButton={({ onClick, addText }) => (
      <AddButton onClick={onClick}>
        <Flex>
          <Box mr={2}>
            <PlusIcon width={16} height={16} />
          </Box>
          {addText}
        </Flex>
      </AddButton>
    )}
    disableRemove
  >
    {({
      name,
      index,
      fields: {
        remove,
        value: { length }
      }
    }) => (
      <>
        {Header && <Header index={index} />}
        <Wrapper is={vertical && Box}>
          <Fields name={name} />
          {length > 1 &&
            (firstItemPinned && !index ? null : (
              <RemoveButton
                buttonText={removeText}
                onClick={() => remove(index)}
              />
            ))}
        </Wrapper>
      </>
    )}
  </Field.Array>
);

export default ArrayField;

const DefaultRemoveButton = ({ buttonText, onClick }) => (
  <Button mb={5} type="reset" variant="red" onClick={onClick}>
    {buttonText}
  </Button>
);

const Wrapper = system({
  is: Flex
});

const AddButton = system(
  {
    fontSize: 0,
    color: "rockmanBlue"
  },
  {
    display: "inline-block",
    verticalAlign: "middle",
    userSelect: "none",
    outline: "none",
    textDecoration: "none",
    cursor: "pointer",
    fontWeight: "bold"
  },
  "fontSize",
  "color"
);
