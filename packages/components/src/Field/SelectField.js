import React from "react";
import Downshift from "downshift";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";
import { pickProps } from "@ehealth/utils";

import Field from "./Field";
import FieldView from "./FieldView";
import { InputBorder, Input, InputContent, ErrorMessage } from "./InputField";

const DOWNSHIFT_PROPS = [
  "itemToString",
  "selectedItemChanged",
  "getA11yStatusMessage",
  "onStateChange",
  "onInputValueChange",
  "itemCount",
  "highlightedIndex",
  "inputValue",
  "isOpen",
  "id",
  "environment",
  "onOuterClick"
];

const SelectField = ({
  label,
  horizontal,
  disabled,
  dataTestButton,
  items = [],
  filterItems = (inputValue, item, index) => true,
  renderItem = item => item,
  keyExtractor = (item, index) => item.key || index,
  ...props
}) => (
  <DownshiftField {...props}>
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
      <FieldView {...getRootProps({ refKey: "innerRef", label, horizontal })}>
        <InputBorder
          disabled={disabled}
          errored={errored}
          active={active}
          size={size}
        >
          <SelectInput
            {...getInputProps({
              ...input,
              disabled,
              onFocus,
              onBlur,
              size,
              onKeyDown: event => {
                if (!isOpen && event.key === "Backspace") {
                  clearSelection();
                }
              }
            })}
          />
          <DropdownArrow
            {...getToggleButtonProps({
              open: isOpen,
              onFocus,
              onBlur,
              disabled,
              size
            })}
            data-test={dataTestButton}
          />
        </InputBorder>
        {errored && <ErrorMessage>{error}</ErrorMessage>}
        {isOpen && (
          <Dropdown>
            {items
              .filter(
                (item, index) =>
                  !inputValue || filterItems(inputValue, item, index)
              )
              .map((item, index) => {
                const active = item === selectedItem;

                return (
                  <Option
                    {...getItemProps({
                      item,
                      active,
                      highlighted: index === highlightedIndex,
                      key: keyExtractor(item, index),
                      onClick: event => {
                        if (active) {
                          event.preventDefault();
                          clearSelection();
                        }
                      }
                    })}
                    data-test={item}
                  >
                    {renderItem(item)}
                  </Option>
                );
              })}
          </Dropdown>
        )}
      </FieldView>
    )}
  </DownshiftField>
);

export default SelectField;

const DownshiftField = ({ children, render = children, ...props }) => {
  const [downshiftProps, fieldProps] = pickProps(props, DOWNSHIFT_PROPS);

  return (
    <Field allowNull {...fieldProps}>
      {({ input: { value, onChange, ...input }, ...fieldRenderProps }) => (
        <Downshift
          {...downshiftProps}
          selectedItem={value}
          onChange={onChange}
          render={downshiftRenderProps =>
            render({ ...downshiftRenderProps, ...fieldRenderProps, input })
          }
        />
      )}
    </Field>
  );
};

export const SelectInput = styled(Input)`
  padding-right: 0;
`;

export const DropdownArrow = styled(InputContent.withComponent("button"))`
  background: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;

  &::before {
    content: "";
    display: block;
    border-width: 5px 5px 0;
    border-style: solid;
    border-color: ${ifProp(
      "disabled",
      "#efefef transparent",
      "#282828 transparent"
    )};
    transform: ${ifProp("open", "rotate(180deg)")};
    transition: transform 0.2s ease;
    will-change: transform;
  }
`;

export const Dropdown = styled.ul`
  background-color: #fff;
  border-width: 0 1px 1px;
  border-style: solid;
  border-color: #dedede;
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: left;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 9999;
  max-height: 200px;
  overflow-y: scroll;
`;

export const Option = styled.li`
  background-color: ${ifProp("highlighted", "#f5f5f5")};
  color: ${ifProp("active", "#11d8fb")};
  cursor: default;
  padding: 10px 50px 10px 10px;
  line-height: 16px;
`;
