import React, { Component } from "react";
import Downshift from "downshift";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";

import SelectList from "./SelectList";

export class Select extends Component {
  render() {
    const {
      items = [],
      handleChange = () => {},
      placeHolder = "Вибрати"
    } = this.props;
    return (
      <Downshift
        onChange={selection => handleChange(selection)}
        itemToString={item => (item ? item.value : "")}
      >
        {({
          getRootProps,
          getInputProps,
          getItemProps,
          getToggleButtonProps,
          isOpen,
          inputValue,
          selectedItem,
          toggleMenu,
          clearSelection
        }) => (
          <Container {...getRootProps({ refKey: "innerRef" })}>
            <SelectInput
              onClick={() => {
                toggleMenu();
              }}
            >
              <input
                placeholder={placeHolder}
                {...getInputProps({
                  onChange: e => {
                    if (e.target.value === "") {
                      clearSelection();
                    }
                  }
                })}
              />
              <ControllerButton
                {...getToggleButtonProps({
                  onClick(event) {
                    event.stopPropagation();
                  }
                })}
                isOpen={isOpen}
              />
            </SelectInput>
            <SelectList
              isOpen={isOpen}
              itemsList={items}
              getItemProps={getItemProps}
              inputValue={inputValue}
            />
          </Container>
        )}
      </Downshift>
    );
  }
}

export default Select;

const Container = styled.div`
  width: 245px;
  margin: auto;
  position: relative;
`;

const SelectInput = styled.div`
  height: 36px;
  padding: 0 15px;
  background-image: linear-gradient(0deg, #f2f4f7 0%, #ffffff 100%);
  border: 1px solid #ced0da;
  color: #979ca6;
  cursor: pointer;
  box-sizing: border-box;
  input {
    height: 100%;
  }
`;

const ControllerButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  width: 47px;
  height: 100%;
  cursor: pointer;
  &::after {
    content: "";
    display: inline-block;
    width: 5px;
    height: 5px;
    border: 1px solid #a8aab7;
    border-width: 1px 1px 0 0;
    transform: rotate(${ifProp("isOpen", "315deg", "135deg")});
    margin: 0 10px;
    vertical-align: middle;
  }
`;
