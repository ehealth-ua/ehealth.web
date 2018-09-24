//@flow
import * as React from "react";
import styled from "react-emotion/macro";
import Dropdown from "../Dropdown";
import { DropDownButton } from "@ehealth/icons";
import { checkLastInList } from "@ehealth/utils";

type HeaderDataWithStatus = {|
  name: string,
  status: boolean,
  title: string
|};

type TableDropDownControllType = {
  onChange: () => mixed,
  data: Array<HeaderDataWithStatus | any>,
  columnKeyExtractor: (string, number) => string,
  buttonComponent?: React.ElementType,
  buttonContent?: React.ElementType
};

type TableDropdownType = {
  data: Array<HeaderDataWithStatus | any>,
  onChange: string => mixed,
  columnKeyExtractor: (string, number) => string
};

const TableDropDownControll = ({
  onChange,
  data,
  columnKeyExtractor,
  // $FlowFixMe https://github.com/facebook/flow/issues/6832
  buttonComponent: ButtonDropDownWrapper = ButtonDropDown,
  // $FlowFixMe https://github.com/facebook/flow/issues/6832
  buttonContent: ButtonContent = Icon
}: TableDropDownControllType) => (
  <ButtonDropDownWrapper>
    <details>
      <ButtonContent>
        <DropDownButton />
      </ButtonContent>

      <TableDropdown
        data={data}
        onChange={onChange}
        columnKeyExtractor={columnKeyExtractor}
      />
    </details>
  </ButtonDropDownWrapper>
);

const TableDropdown = ({
  data,
  onChange,
  columnKeyExtractor
}: TableDropdownType) => (
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
