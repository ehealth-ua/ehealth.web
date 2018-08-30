import React from "react";
import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";

const SelectList = React.forwardRef(
  ({ isOpen, itemsList, inputValue, getItemProps }, ref) => (
    <Container innerRef={ref} isOpen={isOpen}>
      {isOpen
        ? itemsList
            .filter(
              item =>
                !inputValue ||
                item.value.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((item, index) => (
              <Item
                {...getItemProps({
                  key: item.value,
                  index,
                  item
                })}
              >
                {item.value}
              </Item>
            ))
        : null}
    </Container>
  )
);

export default SelectList;

const Container = styled.ul`
  padding: 0;
  margin-top: 0;
  position: absolute;
  background-color: white;
  width: 100%;
  max-height: 20rem;
  overflow-y: auto;
  overflow-x: hidden;
  outline: 0;
  transition: opacity 0.1s ease;
  border: ${ifProp("isOpen", "1px solid #dfe3e9", "none")};
  border-top-width: 0;
`;

const Item = styled.li`
  position: relative;
  display: block;
  text-align: left;
  padding: 12px;
  &:hover {
    background-color: #e9edf1;
  }
`;
