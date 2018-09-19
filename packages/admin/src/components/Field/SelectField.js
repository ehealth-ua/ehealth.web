import React from "react";

import Dropdown from "../Dropdown";
import { DropdownButton, List } from "../MultiSelectView";
import * as FieldView from "../FieldView";
import * as InputView from "../InputView";
import { SingleDownshift } from "./DownshiftField";

import { ChevronBottomIcon } from "@ehealth/icons";

/**
 * @example
 *
 * ```jsx
 * <Form {...props}>
 *   <Select items={items} name="singleSelectName" />
 *   <Form.Submit block>Далі</Form.Submit>
 * </Form>
 * ```
 *
 * Optional prop "type" with possible values "disabled" and "select"
 *
 * Without "type" select works with search field and filter in List
 * With type="select" select works like classic select field, without search and filtering, and with gradient background
 * With type="disabled" select will be disabled
 */

const SelectField = ({ label, hint, warning, items = [], type, ...props }) => (
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
              type,
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
          <DropdownButton
            {...getToggleButtonProps({
              open: isOpen,
              type
            })}
          >
            <ChevronBottomIcon color="#a8aab7" />
          </DropdownButton>
          {isOpen && (
            <List isOpen={isOpen} absolute top="100%">
              {items
                .filter(
                  item =>
                    !type
                      ? !inputValue ||
                        item.value
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      : item
                )
                .map((item, index) => (
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
                ))}
            </List>
          )}
        </InputView.Border>

        <FieldView.Footer>
          <FieldView.Message>{errored ? error : warning}</FieldView.Message>
        </FieldView.Footer>
      </FieldView.Wrapper>
    )}
  </SingleDownshift>
);

export default SelectField;
