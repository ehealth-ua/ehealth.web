//@flow

import * as React from "react";
import styled from "react-emotion/macro";
import { css } from "react-emotion";
import { ifProp } from "styled-tools";
import { CaretDownIcon, CaretUpIcon } from "@ehealth/icons";
import { filterTableColumn } from "@ehealth/utils";
import TableDropDownControll from "./TableDropDownControll";
import { TableCell } from "./AdminTable";

type TableHeaderType = {
  header: HeaderData,
  columnKeyExtractor: (string, number) => string,
  filterTableColumn: (Array<HeaderDataWithStatus | any>, string) => boolean,
  headerComponent: React.ElementType,
  rowComponent: React.ElementType,
  headerCellComponent: React.ElementType,
  sortElements: Array<string>,
  sortParams: SortParamsType,
  onSort: SortParamsType => mixed,
  filterRow: Array<HeaderDataWithStatus | any>,
  onFilter: () => mixed
};

type HeaderData = { [string]: string };

type HeaderDataWithStatus = {|
  name: string,
  status: boolean,
  title: string
|};

type SortParamsType = {
  sortEncrease: boolean,
  sortBy: string
};

const TableHeader = ({
  header,
  columnKeyExtractor,
  filterTableColumn = filterTableColumn,
  headerComponent: HeaderComponent,
  rowComponent: RowComponent,
  headerCellComponent: HeaderCellComponent,
  sortElements,
  sortParams: { sortEncrease, sortBy },
  onSort,
  filterRow,
  onFilter
}: TableHeaderType) => (
  <HeaderComponent>
    <RowComponent>
      {Object.entries(header)
        .filter(([headerName, content]) =>
          filterTableColumn(filterRow, headerName)
        )
        .map(([name, content], index) => {
          const sortStatus = sortElements.includes(name);
          return (
            <HeaderCellComponent
              key={columnKeyExtractor(name, index)}
              onClick={
                sortStatus
                  ? () =>
                      onSort({
                        sortBy: name,
                        sortEncrease: !sortEncrease
                      })
                  : () => {}
              }
            >
              <ContentBlock
                content={content}
                prefix={sortStatus}
                icon={
                  sortBy !== name ? (
                    <CaretUpAndDownIcon />
                  ) : sortEncrease ? (
                    <CaretUpIcon />
                  ) : (
                    <CaretDownIcon />
                  )
                }
              />
            </HeaderCellComponent>
          );
        })}

      <TableDropDownControll
        data={filterRow}
        onChange={onFilter}
        columnKeyExtractor={columnKeyExtractor}
      />
    </RowComponent>
  </HeaderComponent>
);

const ContentBlock = ({ content, icon, prefix }) => (
  <Content>
    {content}
    {prefix && <Icon key="icon">{icon}</Icon>}
  </Content>
);

const CaretUpAndDownIcon = () => (
  <>
    <CaretUpIcon />
    <Icon key="icon" iconDown>
      <CaretDownIcon />
    </Icon>
  </>
);

const Content = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
  justify-content: space-between;
  align-items: center;
  text-align: left;
`;

const Icon = styled.span`
  line-height: 2px;
  display: block;
  ${ifProp(
    "iconDown",
    css`
      margin-top: 3px;
    `
  )};
`;

export default TableHeader;
