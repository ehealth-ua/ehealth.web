import React from "react";
import matchSorter from "match-sorter";
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
  filterKey,
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
      list = (props.filter && props.filter(items)) ||
        matchSorter(items, inputValue, filterKey && { keys: [filterKey] }),
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
            <MultiSelectView.SelectedItem key={item}>
              {filterKey ? item[filterKey] : item}
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
              {list.map(
                (item, index) =>
                  !selectedItems.includes(item) && (
                    <Dropdown.Item
                      {...getItemProps({
                        key: index,
                        index,
                        item,
                        on: highlightedIndex === index
                      })}
                    >
                      {filterKey ? item[filterKey] : item}
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
