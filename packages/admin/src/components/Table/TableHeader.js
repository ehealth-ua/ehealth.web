import React, { Component } from "react";
import styled from "react-emotion/macro";
import { css } from "react-emotion";
import { ifProp } from "styled-tools";
import { CaretDownIcon, CaretUpIcon } from "@ehealth/icons";
import { filterTableColumn } from "@ehealth/utils";
import TableDropDownControll from "./TableDropDownControll";
import { TableCell } from "./AdminTable";

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
}) => (
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

      <TableDropDownControll data={filterRow} onChange={onFilter} />
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  position: relative;
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
