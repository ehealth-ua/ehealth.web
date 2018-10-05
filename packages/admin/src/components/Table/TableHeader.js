//@flow
import * as React from "react";
import styled from "react-emotion/macro";
import { css } from "react-emotion";
import { ifProp } from "styled-tools";
import { Switch } from "@ehealth/components";
import { CaretDownIcon, CaretUpIcon } from "@ehealth/icons";
import { filterTableColumn as filterTableDefaultColumn } from "@ehealth/utils";

type HeaderData = { [string]: string };

type HeaderDataWithStatus = {|
  name: string,
  status: boolean,
  title: string
|};

export type SortingParams = {|
  name?: string,
  order?: "ASC" | "DESC"
|};

type TableHeaderType = {
  header: HeaderData,
  columnKeyExtractor: (string, number) => string,
  filterTableColumn: (Array<HeaderDataWithStatus | any>, string) => boolean,
  headerComponent: React.ElementType,
  rowComponent: React.ElementType,
  headerCellComponent: React.ElementType,
  sortableFields?: string[],
  sortingParams?: SortingParams,
  onSortingChange?: SortingParams => mixed,
  filterRow: Array<HeaderDataWithStatus | any>
};

const TableHeader = ({
  header,
  columnKeyExtractor,
  filterTableColumn = filterTableDefaultColumn,
  headerComponent: HeaderComponent,
  rowComponent: RowComponent,
  headerCellComponent: HeaderCellComponent,
  sortableFields = [],
  sortingParams = {},
  onSortingChange = () => {},
  filterRow
}: TableHeaderType) => (
  <HeaderComponent>
    <RowComponent>
      {Object.entries(header)
        .filter(([headerName, content]) =>
          filterTableColumn(filterRow, headerName)
        )
        .map(([name, content], index) => {
          const isSortable = sortableFields.includes(name);
          return (
            <HeaderCellComponent
              key={columnKeyExtractor(name, index)}
              onClick={
                isSortable
                  ? () =>
                      onSortingChange({
                        name,
                        order: sortingParams.order === "ASC" ? "DESC" : "ASC"
                      })
                  : undefined
              }
            >
              <ContentBlock
                content={content}
                prefix={isSortable}
                icon={
                  <Switch
                    value={sortingParams.name === name && sortingParams.order}
                    ASC={<CaretUpIcon />}
                    DESC={<CaretDownIcon />}
                    default={<CaretUpAndDownIcon />}
                  />
                }
              />
            </HeaderCellComponent>
          );
        })}
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
