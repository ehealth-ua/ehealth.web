import React from "react";
import { RemoveItemIcon } from "@ehealth/icons";

import { MultiDownshift } from "./DownshiftField";
import Dropdown from "../Dropdown";
import * as MultiSelectView from "../MultiSelectView";
import * as FieldView from "../FieldView";
import * as InputView from "../InputView";

const MultiSelect = ({
  label,
  hint,
  warning,
  items = [],
  placeHolder = "Вибрати",
  name,
  filterItems = (inputValue, item) =>
    item.value.toLowerCase().includes(inputValue.toLowerCase()),
  ...props
}) => (
  <MultiDownshift itemToString={() => ""} name={name}>
    {({
      getRootProps,
      getInputProps,
      getRemoveButtonProps,
      removeItem,
      isOpen,
      inputValue,
      selectedItems,
      getItemProps,
      toggleMenu,
      highlightedIndex,
      meta: { active, errored, error }
    }) => (
      <FieldView.Wrapper
        {...getRootProps({
          refKey: "innerRef"
        })}
      >
        {label && (
          <FieldView.Header>
            <FieldView.Label>{label}</FieldView.Label>
            {hint && <FieldView.Message>{hint}</FieldView.Message>}
          </FieldView.Header>
        )}
        <InputView.Border position="relative" flexWrap="wrap">
          {selectedItems.map(item => (
            <MultiSelectView.SelectedItem key={item.value}>
              {item.value}
              <MultiSelectView.RemoveItem {...getRemoveButtonProps({ item })}>
                <RemoveItemIcon />
              </MultiSelectView.RemoveItem>
            </MultiSelectView.SelectedItem>
          ))}
          <InputView.Content
            {...getInputProps({
              is: "input",
              px: 2,
              width: 0,
              placeholder: selectedItems.length > 0 ? "" : placeHolder,
              onFocus: toggleMenu,
              onKeyUp(event) {
                if (event.key === "Backspace" && !inputValue) {
                  removeItem(selectedItems[selectedItems.length - 1]);
                }
              }
            })}
          />
          {isOpen && (
            <MultiSelectView.List>
              {items
                .filter(item => !inputValue || filterItems(inputValue, item))
                .map(
                  (item, index) =>
                    !selectedItems.includes(item) && (
                      <Dropdown.Item
                        {...getItemProps({
                          key: item.value,
                          index,
                          item,
                          on: highlightedIndex === index
                        })}
                      >
                        {item.value}
                      </Dropdown.Item>
                    )
                )}
            </MultiSelectView.List>
          )}
        </InputView.Border>

        <FieldView.Footer>
          <FieldView.Message>{errored ? error : warning}</FieldView.Message>
        </FieldView.Footer>
      </FieldView.Wrapper>
    )}
  </MultiDownshift>
);

export default MultiSelect;
