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
  fields: Fields
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
    removeButton={({ onClick, index }) =>
      index ? (
        <Button mb={5} type="reset" variant="red" onClick={onClick}>
          {removeText}
        </Button>
      ) : null
    }
  >
    {({ name, index }) => <Fields name={name} index={index} />}
  </Field.Array>
);

export default ArrayField;

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
