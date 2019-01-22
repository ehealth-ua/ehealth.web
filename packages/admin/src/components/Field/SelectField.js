import React from "react";
import matchSorter from "match-sorter";

import Dropdown from "../Dropdown";
import { List, DropdownButton, DropdownIcon } from "./MultiSelectView";
import * as FieldView from "./FieldView";
import * as InputView from "./InputView";
import { SingleDownshift } from "./DownshiftField";

/**
 *
 * @example
 *
 * ```jsx
 * <Form {...props}>
 *   <Field.Select items={doctors} name="doctors" disabled />
 *   <Form.Submit block>Далі</Form.Submit>
 * </Form>
 * ```
 *
 * For passing an Array of Objects to the items prop,
 * you must specify the key in renderItem, itemToString and, for custom filtering, in filterOptions.
 *
 * @example below will be filtering by doctors.name key and show the doctors.name value in the select list
 * const doctors = [{name: "John Doe", speciality: "Family Doctor", clinic: "Doe & Doe"}, {...}]
 * <Field.Select
 *   items={doctors}
 *   name="doctors"
 *   renderItem={item => item.name }
 *   itemToString={item => {
 *     if (!item) return "";
 *     return variantof item === "string"
 *       ? item
 *       : item.name
 *   }}
 *   filterOptions={
 *    { keys: ["name"] }
 *   }
 * />
 *
 * Optional prop "variant" with possible value "select"
 * Without "variant" select works with search field and filter in List
 * With variant="select" select works like classic select field, without search and filtering, and with gradient background
 */

const SelectField = ({
  label,
  hint,
  warning,
  items = [],
  variant,
  filterOptions,
  filter = matchSorter,
  hideErrors = false,
  iconComponent: Icon = DropdownIcon,
  itemToString = i => (i == null ? "" : String(i)),
  renderItem = itemToString,
  emptyOption,
  ...props
}) => (
  <SingleDownshift itemToString={itemToString} {...props}>
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
      <FieldView.Wrapper {...getRootProps({ refKey: "ref" })}>
        {label && (
          <FieldView.Header>
            <FieldView.Label>{label}</FieldView.Label>
            {hint && <FieldView.Message>{hint}</FieldView.Message>}
          </FieldView.Header>
        )}

        <InputView.Border
          position="relative"
          flexWrap="wrap"
          variant={errored && "errored"}
        >
          <InputView.Content
            {...getInputProps({
              is: "input",
              pl: 2,
              pr: 4,
              width: 0,
              disabled,
              ...input,
              variant,
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
              variant,
              type: "div"
            })}
          >
            <Icon />
          </DropdownButton>
          {isOpen && (
            <List>
              {filter(
                emptyOption ? ["", ...items] : items,
                !variant && inputValue,
                filterOptions
              ).map((item, index) => (
                <Dropdown.Item
                  {...getItemProps({
                    key: index,
                    index,
                    item,
                    on: highlightedIndex === index
                  })}
                >
                  {renderItem(item)}
                </Dropdown.Item>
              ))}
            </List>
          )}
        </InputView.Border>

        {!hideErrors && (
          <FieldView.Footer>
            <FieldView.Message variant={errored && "errored"}>
              {errored ? error : warning}
            </FieldView.Message>
          </FieldView.Footer>
        )}
      </FieldView.Wrapper>
    )}
  </SingleDownshift>
);

export default SelectField;
