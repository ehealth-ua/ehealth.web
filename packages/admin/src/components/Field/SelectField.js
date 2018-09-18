import React from "react";

import Dropdown from "../Dropdown";
import { DropdownArrow, List } from "../MultiSelectView";
import * as FieldView from "../FieldView";
import * as InputView from "../InputView";
import { SingleDownshift } from "./DownshiftField";

const SelectField = ({ label, hint, warning, items = [], ...props }) => (
  <SingleDownshift {...props} itemToString={item => (item ? item.value : "")}>
    {({
      getRootProps,
      getInputProps,
      getToggleButtonProps,
      getItemProps,
      isOpen,
      inputValue,
      highlightedIndex,
      selectedItem,
      openMenu,
      clearSelection,
      input: { onFocus, onBlur, size, ...input },
      meta: { active, errored, error }
    }) => (
      <FieldView.Wrapper {...getRootProps({ refKey: "innerRef" })}>
        {label && (
          <FieldView.Header>
            <FieldView.Label>{label}</FieldView.Label>
            {hint && <FieldView.Message>{hint}</FieldView.Message>}
          </FieldView.Header>
        )}

        <InputView.Border position="relative" flexWrap="wrap">
          <InputView.Content
            {...getInputProps({
              is: "input",
              px: 2,
              width: 0,
              ...input,
              onKeyDown: event => {
                if (!isOpen && event.key === "Backspace") {
                  clearSelection();
                }
              },
              onChange: e => {
                if (e.target.value === "") {
                  clearSelection();
                }
              }
            })}
          />
          <DropdownArrow
            {...getToggleButtonProps({
              open: isOpen
            })}
          />
          <List isOpen={isOpen} absolute top="100%">
            {isOpen
              ? items
                  .filter(
                    item =>
                      !inputValue ||
                      item.value
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                  )
                  .map((item, index) => (
                    <Dropdown.Item
                      {...getItemProps({
                        key: item.value,
                        index,
                        item
                      })}
                    >
                      {item.value}
                    </Dropdown.Item>
                  ))
              : null}
          </List>
        </InputView.Border>

        <FieldView.Footer>
          <FieldView.Message>{errored ? error : warning}</FieldView.Message>
        </FieldView.Footer>
      </FieldView.Wrapper>
    )}
  </SingleDownshift>
);

export default SelectField;
