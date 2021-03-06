//@flow
import * as React from "react";
import styled from "@emotion/styled";
import { Box, Flex } from "@rebass/emotion";
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
  columnKeyExtractor: (string, number) => React.Key,
  buttonComponent?: React.ElementType,
  buttonContent?: React.ElementType,
  description?: string
};

type TableDropdownType = {
  data: Array<HeaderDataWithStatus | any>,
  onChange: string => mixed,
  columnKeyExtractor: (string, number) => React.Key
};

const TableDropDownControll = ({
  onChange,
  data,
  columnKeyExtractor = (name, index) => name,
  // $FlowFixMe https://github.com/facebook/flow/issues/6832
  buttonComponent: ButtonDropDownWrapper = Box,
  // $FlowFixMe https://github.com/facebook/flow/issues/6832
  buttonContent: ButtonContent = Icon,
  description = "Додати параметр"
}: TableDropDownControllType) => (
  <ButtonDropDownWrapper>
    <details>
      <ButtonContent>
        <Flex>
          <DropDownButton color="#2EA2F8" />
          <Description>{description}</Description>
        </Flex>
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

const Icon = styled.summary`
  list-style-type: none;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const Description = styled.span`
  margin-left: 10px;
  color: #2ea2f8;
  font-size: 12px;
  font-weight: 700;
`;

const List = styled(Dropdown.List)`
  position: absolute;
  left: auto;
  right: 20px;
  margin-top: 10px;
  z-index: 50;
`;

export default TableDropDownControll;
