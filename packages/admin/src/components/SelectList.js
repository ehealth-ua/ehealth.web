import React from "react";
import Dropdown from "./Dropdown";

const SelectList = React.forwardRef(
  ({ isOpen, itemsList, inputValue, getItemProps }, ref) => (
    <Dropdown.List innerRef={ref} isOpen={isOpen}>
      {isOpen
        ? itemsList
            .filter(
              item =>
                !inputValue ||
                item.value.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((item, index) => (
              <Dropdown.Item
                {...getItemProps({
                  key: item.value,
                  index,
                  item
                })}
              >
                {item.value}
              </Dropdown.Item>
            ))
        : null}
    </Dropdown.List>
  )
);

export default SelectList;
