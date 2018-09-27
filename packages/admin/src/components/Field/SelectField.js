import React from "react";
import matchSorter from "match-sorter";

import Dropdown from "../Dropdown";
import { List, DropdownButton, DropdownIcon } from "../MultiSelectView";
import * as FieldView from "../FieldView";
import * as InputView from "../InputView";
import { SingleDownshift } from "./DownshiftField";
import { ChevronBottomIcon } from "@ehealth/icons";
/**
 *
 * @example
 *
 * ```jsx
 * <Form {...props}>
 *   <Select items={clinics} name="clinics" />
 *   <Select items={doctors} name="doctors" disabled />
 *   <Form.Submit block>Далі</Form.Submit>
 * </Form>
 * ```
 * Possible values for items prop are Array of Strings and Array of Objects
 *
 * For passing an Array of Objects, you must specify the key for filtering in filterKey prop.
 * @example below will be filtering by doctors.name key
 * const doctors = [{name: "John Doe", speciality: "Family Doctor", clinic: "Doe & Doe"}, {...}]
 * <Field.Select items={doctors} name="doctors" filterKey="name" />
 *
 * Optional prop "type" with possible value "select"
 * Without "type" select works with search field and filter in List
 * With type="select" select works like classic select field, without search and filtering, and with gradient background
 */

const SelectField = ({
  label,
  hint,
  warning,
  items = [],
  type,
  filterKey,
  filter = matchSorter,
  ...props
}) => (
  <SingleDownshift
    {...props}
    itemToString={item => (filterKey ? (item ? item[filterKey] : "") : item)}
  >
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
      input: { onFocus, onBlur, size, disabled, ...input },
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
              disabled,
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
              disabled,
              type
            })}
          >
            <DropdownIcon />
          </DropdownButton>
          {isOpen && (
            <List>
              {filter(
                items,
                !type && inputValue,
                filterKey && { keys: [filterKey] }
              ).map((item, index) => (
                <Dropdown.Item
                  {...getItemProps({
                    key: item,
                    index,
                    item,
                    on: highlightedIndex === index
                  })}
                >
                  {filterKey ? item[filterKey] : item}
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
