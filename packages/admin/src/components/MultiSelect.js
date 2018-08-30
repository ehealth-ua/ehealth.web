import React, { Component } from "react";
import Downshift from "downshift";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";

import SelectList from "./SelectList";

class MultiDownshift extends Component {
  state = { selectedItems: [] };

  stateReducer = (state, changes) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          isOpen: true
        };
      default:
        return changes;
    }
  };

  handleSelection = (selectedItem, downshift) => {
    const callOnChange = () => {
      if (this.props.onSelect) {
        this.props.onSelect(
          this.state.selectedItems,
          this.getStateAndHelpers(downshift)
        );
      }
      if (this.props.onChange) {
        this.props.onChange(
          this.state.selectedItems,
          this.getStateAndHelpers(downshift)
        );
      }
    };
    if (this.state.selectedItems.includes(selectedItem)) {
      this.removeItem(selectedItem, callOnChange);
    } else {
      this.addSelectedItem(selectedItem, callOnChange);
    }
  };

  removeItem = (item, cb) => {
    this.setState(({ selectedItems }) => {
      return {
        selectedItems: selectedItems.filter(i => i !== item)
      };
    }, cb);
  };
  addSelectedItem(item, cb) {
    this.setState(
      ({ selectedItems }) => ({
        selectedItems: [...selectedItems, item]
      }),
      cb
    );
  }

  getRemoveButtonProps = ({ onClick, item, ...props } = {}) => {
    return {
      onClick: e => {
        onClick && onClick(e);
        e.stopPropagation();
        this.removeItem(item);
      },
      ...props
    };
  };

  getStateAndHelpers(downshift) {
    const { selectedItems } = this.state;
    const { getRemoveButtonProps, removeItem } = this;
    return {
      getRemoveButtonProps,
      removeItem,
      selectedItems,
      ...downshift
    };
  }
  render() {
    const { render, children = render, ...props } = this.props;
    return (
      <Downshift
        {...props}
        stateReducer={this.stateReducer}
        onChange={this.handleSelection}
        selectedItem={null}
      >
        {downshift => children(this.getStateAndHelpers(downshift))}
      </Downshift>
    );
  }
}

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
      <Container {...getRootProps({ refKey: "innerRef" })}>
        <MultiSelectInput
          onClick={() => {
            toggleMenu();
          }}
          leftPadding={!selectedItems.length}
        >
          {selectedItems.length > 0
            ? selectedItems.map(item => (
                <SelectedItem key={item.value}>
                  <span>{item.value}</span>
                  <CloseButton {...getRemoveButtonProps({ item })} />
                </SelectedItem>
              ))
            : placeHolder}
          <input
            {...getInputProps({
              onKeyUp(event) {
                if (event.key === "Backspace" && !inputValue) {
                  removeItem(selectedItems[selectedItems.length - 1]);
                }
              }
            })}
            style={{ minHeight: "30px", padding: "0 5px" }}
          />
        </MultiSelectInput>
        <SelectList
          isOpen={isOpen}
          itemsList={items}
          getItemProps={getItemProps}
          inputValue={inputValue}
        />
      </Container>
    )}
  </MultiDownshift>
);

export default MultiSelect;

const MultiSelectInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: #fff;
  border: 1px solid #dfe3e9;
  color: #979ca6;
  cursor: pointer;
  min-height: 36px;
  box-sizing: border-box;
  padding: ${ifProp("leftPadding", "0 0 0 15px", "0 0 2px 0")};
`;

const Container = styled.div`
  width: 245px;
  margin: auto;
  position: relative;
`;

const SelectedItem = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  background-color: #f1f4f8;
  border: 1px solid #d5dce6;
  color: #333c48;
  border-radius: 3px;
  height: 30px;
  padding: 0 12px;
  margin: 2px 0 0 2px;
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  position: relative;

  &:before,
  &:after {
    content: " ";
    position: absolute;
    top: 50%;
    width: 8px;
    height: 2px;
    background-color: #c7d2e0;
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`;
