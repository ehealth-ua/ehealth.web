import styled from "react-emotion/macro";
import { ifProp } from "styled-tools";

import { CheckRightIcon } from "@ehealth/icons";

const Dropdown = {};

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  font-size: 14px;
  border-top: 1px solid #dfe3e9;
  color: ${ifProp("on", "#2EA2F8", "#354052")};
  background: ${ifProp("on", "#F1F4F8", "#fff")};
  user-select: none;
  cursor: pointer;
  &:first-child {
    border-top: none;
  }
`;

const List = styled.div`
  max-width: 400px;
  box-shadow: 0 2px 4px rgba(72, 60, 60, 0.2);
`;

const Icon = styled(CheckRightIcon)`
  flex-basis: 10px;
  width: 10px;
  height: 10px;
`;

Dropdown.List = List;
Dropdown.Item = Item;
Dropdown.Icon = Icon;

export default Dropdown;
