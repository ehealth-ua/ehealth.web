import React, { Component } from "react";
import styled from "react-emotion/macro";
import Dropdown from "../Dropdown";
import { DropDownButton } from "@ehealth/icons";
import { checkLastInList } from "@ehealth/utils";

const TableDropDownControll = ({
  onChange,
  data,
  buttonComponent: ButtonDropDownWrapper = ButtonDropDown,
  buttonContent: ButtonContent = Icon
}) => (
  <ButtonDropDownWrapper>
    <details>
      <ButtonContent>
        <DropDownButton />
      </ButtonContent>

      <TableDropdown data={data} onChange={onChange} />
    </details>
  </ButtonDropDownWrapper>
);

const TableDropdown = ({
  data,
  onChange,
  columnKeyExtractor = name => name
}) => (
  <List>
    {data.map(({ title, name, status }, index, array) => (
      <Dropdown.Item
        on={status}
        onClick={checkLastInList(data, name) ? () => onChange(name) : () => {}}
        key={columnKeyExtractor(name, index)}
      >
        {title}
        {status && <Dropdown.Icon />}
      </Dropdown.Item>
    ))}
  </List>
);

const ButtonDropDown = styled.th`
  position: relative;
  width: 30px;
  padding: 14px 0px;
`;

const Icon = styled.summary`
  display: block;
  line-height: 2px;
  font-size: 0;
  list-style-type: none;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const List = styled(Dropdown.List)`
  position: absolute;
  left: auto;
  right: 0;
  top: 100%;
`;

export default TableDropDownControll;
