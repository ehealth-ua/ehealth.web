//@flow
import * as React from "react";
import styled from "react-emotion/macro";
import { css } from "react-emotion";
import { ifNotProp } from "styled-tools";
import { Flex } from "rebass/emotion";
import isEqual from "lodash/isEqual";

import { TableView } from "@ehealth/components";
import { ResetIcon } from "@ehealth/icons";

import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import type { SortingParams } from "./TableHeader";
import TableDropDownControll from "./TableDropDownControll";
import TableHeaderCellWithResize from "./TableHeaderCellWithResize";
import Tooltip from "../Tooltip";

type HeaderData = { [string]: string };

type HeaderDataWithStatus = {|
  name: string,
  status: boolean,
  title: string
|};

type TableProps = {|
  data: { value: React.Node },
  header: HeaderData,
  renderRow: { value: React.Node },
  rowKeyExtractor: () => mixed,
  columnKeyExtractor?: () => mixed,
  sortableFields: string[],
  sortingParams: SortingParams,
  onSortingChange: SortingParams => mixed,
  tableName?: string,
  defaultFilter?: (
    data: HeaderData,
    tableName?: string
  ) => Array<HeaderDataWithStatus | any>
|};

type TableState = {|
  filterRow?: Array<HeaderDataWithStatus | null>
|};

/**
 * @example Use Table
 * ```jsx
 * <LocationParams>
 *   {({
 *     locationParams: { sort = "", ...searchParamsRest },
 *     setLocationParams
 *   }) => {
 *     const [sortBy, orderBy] = sort.split("_");
 *     return (
 *       <Table
 *         data={data}
 *         header={{
 *           id: "ID",
 *           divisionName: "Назва",
 *           status: "Статус",
 *           action: "Дія"
 *         }}
 *         renderRow={({  name , id, startDate, status }) => ({
 *           id,
 *           divisionName: name,
 *           status: DECLARATION_STATUSES[status],
 *           action: <Link to={`declaration/${id}`}>Показати деталі</Link>
 *         })}
 *         sortableFields={["status", "id"]}
 *         sortingParams={{ sortBy, sortEncrease: orderBy === "desc" }}
 *         onSortingChange={({ sortBy, sortEncrease, ...props }) =>
 *           setLocationParams({
 *             ...searchParamsRest,
 *             sort: [sortBy, sortEncrease ? "desc" : "asc"].join("_")
 *           })
 *         }
 *         tableName="name"
 *         filteredFields="id,divisionName"
 *       />
 *     );
 *   }}
 * </LocationParams>
 * ```
 */
class Table extends React.Component<TableProps, TableState> {
  state = {
    filterRow: []
  };

  componentDidMount() {
    const {
      header,
      defaultFilter = this.defaultFilter,
      tableName,
      filteredFields = ""
    } = this.props;

    localStorage.getItem(tableName) === null &&
      localStorage.setItem(tableName, filteredFields);

    this.setState({
      filterRow: defaultFilter(header, tableName)
    });
  }

  componentDidUpdate({ data: updateData }) {
    const { data: prevData } = this.props;
    if (!isEqual(updateData, prevData)) {
      const {
        header,
        defaultFilter = this.defaultFilter,
        tableName
      } = this.props;
      this.setState({
        filterRow: defaultFilter(header, tableName)
      });
    }
  }

  render() {
    const {
      data,
      header,
      renderRow,
      rowKeyExtractor,
      columnKeyExtractor,
      sortableFields,
      sortingParams,
      onSortingChange,
      tableName,
      filteredFields = ""
    } = this.props;

    const { filterRow } = this.state;

    return (
      <>
        <Flex mb={2} justifyContent="space-between" alignItems="center">
          <Tooltip
            content="Скинути поточні налаштування"
            component={() => (
              <ResetIcon
                onClick={() => {
                  localStorage.setItem(tableName, filteredFields);
                  this.setState({
                    filterRow: this.defaultFilter(header, tableName)
                  });
                }}
              />
            )}
            height="16px"
          />

          <TableDropDownControll
            data={filterRow}
            onChange={name => {
              const { filterRow = [] } = this.state;
              this.setState(
                {
                  filterRow: filterRow.map(
                    item =>
                      item && item.name === name
                        ? { ...item, status: !item.status }
                        : item
                  )
                },
                () => this.setStorage(tableName, this.state.filterRow)
              );
            }}
            columnKeyExtractor={columnKeyExtractor}
          />
        </Flex>
        <TableWrapper>
          <TableView
            data={data}
            header={header}
            renderRow={renderRow}
            rowKeyExtractor={rowKeyExtractor}
            columnKeyExtractor={columnKeyExtractor}
            tableComponent={TableRoot}
            headerComponent={TableHeaderComponent}
            bodyComponent={TableBodyComponent}
            rowComponent={TableRow}
            headerCellComponent={TableHeaderCellWithResize}
            cellComponent={TableCell}
            tableHeader={TableHeader}
            tableBody={TableBody}
            sortableFields={sortableFields}
            sortingParams={sortingParams}
            onSortingChange={onSortingChange}
            filterRow={filterRow}
          />
        </TableWrapper>
      </>
    );
  }

  defaultFilter = (
    header: HeaderData,
    tableName?: string
  ): Array<HeaderDataWithStatus | any> =>
    Object.entries(header).map(
      ([name, title]) =>
        ({
          name,
          title,
          status: this.checkStorage(name, tableName)
        }: HeaderDataWithStatus)
    );

  checkStorage = (name: string, tableName: string) => {
    const storageItems = localStorage.getItem(tableName);
    return !(storageItems && storageItems.split(",").includes(name));
  };

  setStorage = (name: string, items: Array<any>) => {
    localStorage.setItem(
      name,
      items
        .filter(item => !item.status && item.name)
        .map(item => item.name)
        .join(",")
    );
  };
}

export default Table;

const TableWrapper = styled.div`
  width: 100%;
  overflow: auto;
`;

const TableRoot = styled.table`
  border: 1px solid #e0e0e0;
  border-collapse: collapse;
  color: #3d3d3d;
  font-size: 12px;
  line-height: 20px;
  table-layout: fixed;
  width: 100%;
`;

const TableHeaderComponent = styled.thead`
  background-image: linear-gradient(0deg, #f2f4f7 0%, #ffffff 100%);
  font-size: 12px;
  user-select: none;
  color: #7f8fa4;
`;

const TableBodyComponent = styled.tbody`
  background-color: #fff;
`;

const TableRow = styled.tr`
  ${TableBodyComponent} & {
    &:nth-child(2n) {
      background-color: #fcfcfc;
    }

    &:hover {
      background-color: #f3fdff;
    }
  }
`;

export const TableCell = styled.td`
  border-top: 1px solid #e0e0e0;
  padding: 16px 20px;
  text-align: left;
  vertical-align: middle;
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${ifNotProp(
    "whiteSpaceNoWrap",
    css`
      white-space: nowrap;
    `
  )};
`;
