import React, { Component } from "react";
import Downshift from "downshift";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";

import * as MultiSelectView from "../MultiSelectView";
import SelectList from "../SelectList";
import MultiDownshift from "../MultiDownshift";

import * as InputView from "../InputView";

const MultiSelect = ({
  items = [],
  handleChange = () => {},
  placeHolder = "Вибрати"
}) => (
  <MultiDownshift
    onChange={selectedItems => handleChange(selectedItems)}
    itemToString={() => ""}
  >
    {({
      getRootProps,
      getInputProps,
      getRemoveButtonProps,
      removeItem,
      isOpen,
      inputValue,
      selectedItems,
      getItemProps,
      toggleMenu
    }) => (
      <MultiSelectView.Container {...getRootProps({ refKey: "innerRef" })}>
        <InputView.Border css="flex-wrap:wrap;">
          {selectedItems.map(item => (
            <MultiSelectView.SelectedItem key={item.value}>
              <span>{item.value}</span>
              <MultiSelectView.CloseButton
                {...getRemoveButtonProps({ item })}
              />
            </MultiSelectView.SelectedItem>
          ))}
          <InputView.Content
            is="input"
            {...getInputProps({
              placeHolder: selectedItems.length > 0 ? "" : placeHolder,
              onFocus: toggleMenu,
              onKeyUp(event) {
                if (event.key === "Backspace" && !inputValue) {
                  removeItem(selectedItems[selectedItems.length - 1]);
                }
              }
            })}
          />
        </InputView.Border>
        <SelectList
          isOpen={isOpen}
          itemsList={items}
          getItemProps={getItemProps}
          inputValue={inputValue}
        />
      </MultiSelectView.Container>
    )}
  </MultiDownshift>
);

export default MultiSelect;
