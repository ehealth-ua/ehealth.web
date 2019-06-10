//@flow
import * as React from "react";
import styled from "@emotion/styled/macro";
import { ifProp, ifNotProp } from "styled-tools";
import { mixed, boolean, variant } from "@ehealth/system-tools";
import system from "@ehealth/system-components";
import { Flex } from "@rebass/emotion";
import isEqual from "lodash/isEqual";

import { TableView } from "@ehealth/components";
import { ResetIcon } from "@ehealth/icons";

import ShowItems from "./ShowItems";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import type { SortingParams } from "./TableHeader";
import TableDropDownControll from "./TableDropDownControll";
import TableHeaderCellWithResize from "./TableHeaderCellWithResize";
import Tooltip from "../Tooltip";
import { ITEMS_PER_PAGE } from "../../constants/pagination";

type TableData = { [string]: any };

type HeaderData = { [string]: any };

type HeaderDataWithStatus = {|
  name: string,
  status: boolean,
  title: string
|};

type TableProps = {|
  data: Array<TableData>,
  header: HeaderData,
  renderRow?: ({ [string]: any }) => { [string]: React.Node },
  rowKeyExtractor?: (string, number) => React.Key,
  columnKeyExtractor?: (string, number) => React.Key,
  sortableFields?: string[],
  sortingParams?: SortingParams,
  onSortingChange?: SortingParams => mixed,
  tableName?: string,
  defaultFilter?: (
    data: HeaderData,
    tableName?: string
  ) => Array<HeaderDataWithStatus | any>,
  hidePagination?: boolean,
  whiteSpaceNoWrap?: string[],
  headless?: boolean,
  hiddenFields?: string
  // tableBody?: React.StatelessFunctionalComponent<{
  //   columns: Array<TableData>,
  //   data: Array<TableData>,
  //   rowKeyExtractor?: (string, number) => React.Key,
  //   columnKeyExtractor?: (string, number) => React.Key,
  //   filterTableColumn?: () => mixed,
  //   filterRow?: () => mixed
  // }>
|};

type TableState = {|
  filterRow: Array<HeaderDataWithStatus | null>
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
 *         hiddenFields="id,divisionName"
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
      tableName = "",
      hiddenFields = ""
    } = this.props;

    localStorage.getItem(tableName) === null &&
      localStorage.setItem(tableName, hiddenFields);

    this.setState({
      filterRow: defaultFilter(header, tableName)
    });
  }

  componentDidUpdate({ data: updateData }: { data: Array<TableData> }) {
    const { data: prevData } = this.props;
    if (!isEqual(updateData, prevData)) {
      const {
        header,
        defaultFilter = this.defaultFilter,
        tableName = ""
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
      rowKeyExtractor = i => i,
      columnKeyExtractor = i => i,
      sortableFields,
      sortingParams,
      onSortingChange,
      tableName = "",
      hiddenFields = "",
      whiteSpaceNoWrap,
      headless,
      tableBody: Body = TableBody,
      hidePagination
    } = this.props;
    const { filterRow } = this.state;

    return (
      <>
        {!headless && (
          <Flex
            mb={3}
            mt={5}
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex alignItems="center">
              {!hidePagination && <ShowItems list={ITEMS_PER_PAGE} />}
              <Tooltip
                content="Скинути поточні налаштування"
                component={() => (
                  <ResetIcon
                    onClick={() => {
                      localStorage.setItem(tableName, hiddenFields);
                      localStorage.removeItem(`${tableName}-cell-sizes`);
                      this.setState({
                        filterRow: this.defaultFilter(header, tableName)
                      });
                    }}
                  />
                )}
              />
            </Flex>
            <TableDropDownControll
              data={filterRow}
              onChange={name => {
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
        )}
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
            headerCellComponent={props => (
              <TableHeaderCellWithResize
                storageForSizes={`${tableName}-cell-sizes`}
                header={header}
                {...props}
              />
            )}
            cellComponent={TableCell}
            tableHeader={TableHeader}
            tableBody={Body}
            sortableFields={sortableFields}
            sortingParams={sortingParams}
            onSortingChange={onSortingChange}
            filterRow={filterRow}
            headless={headless}
            whiteSpaceNoWrap={whiteSpaceNoWrap}
          />
        </TableWrapper>
      </>
    );
  }

  defaultFilter = (
    header: HeaderData,
    tableName: string
  ): Array<HeaderDataWithStatus | any> =>
    Object.entries(header).map(
      ([name, title]) =>
        ({
          name,
          status: this.checkStorage(name, tableName),
          title
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

const TableWrapper = system(
  {},
  {
    width: "100%",
    overflow: "auto"
  }
);

export const TableRoot = system(
  {
    color: "black",
    fontSize: 0,
    is: "table"
  },
  props => ({
    tableLayout: "fixed",
    width: "100%",
    borderCollapse: "collapse",
    "& + &": {
      borderTop: 0
    },
    border: ifProp("headless", "none", "1px solid #e0e0e0")(props),
    lineHeight: ifProp("headless", "0", "20px")(props),
    "td:last-of-type": {
      borderRight: "none"
    }
  }),
  "fontSize",
  "color"
);

const TableHeaderComponent = styled.thead`
  background-image: linear-gradient(0deg, #f2f4f7 0%, #ffffff 100%);
  font-size: 12px;
  user-select: none;
  color: #7f8fa4;
  display: ${ifProp("headless", "none")};
  tr {
    border-bottom: 1px solid #e0e0e0;
  }
`;

export const TableBodyComponent = styled.tbody`
  background-color: #fff;
`;

export const TableRow = styled.tr`
  ${TableBodyComponent} & {
    &:nth-child(2n) {
      background-color: #fcfcfc;
    }

    &:hover {
      background-color: #f3fdff;
    }
  }
  &:first-of-type {
    td {
      border-top: none;
    }
  }
`;

export const TableCell = system(
  {
    is: "td"
  },
  props =>
    mixed({
      border: 1,
      borderStyle: "solid",
      borderColor: "jupiter",
      textAlign: "left",
      verticalAlign: "middle",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: ifProp("whiteSpaceNoWrap", "nowrap", "pre-wrap")(props),
      padding: ifNotProp("fullSize", "16px 20px", "0")(props)
    }),
  variant({
    key: "tables"
  }),
  boolean({
    prop: "mismatch",
    key: "tables.mismatch"
  })
);
