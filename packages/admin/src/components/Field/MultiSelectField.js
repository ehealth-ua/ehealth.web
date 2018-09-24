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
      meta: { active, errored, error }
    }) => {
      return (
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
            <MultiSelectView.List isOpen={isOpen}>
              {isOpen
                ? items
                    .filter(
                      item =>
                        !inputValue ||
                        item.value
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                    )
                    .map(
                      (item, index) =>
                        !selectedItems.includes(item) && (
                          <Dropdown.Item
                            {...getItemProps({
                              key: item.value,
                              index,
                              item
                            })}
                          >
                            {item.value}
                          </Dropdown.Item>
                        )
                    )
                : null}
            </MultiSelectView.List>
          </InputView.Border>

          <FieldView.Footer>
            <FieldView.Message>{errored ? error : warning}</FieldView.Message>
          </FieldView.Footer>
        </FieldView.Wrapper>
      );
    }}
  </MultiDownshift>
);

export default MultiSelect;
