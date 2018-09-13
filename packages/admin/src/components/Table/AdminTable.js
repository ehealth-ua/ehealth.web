//@flow
import * as React from "react";
import styled from "react-emotion/macro";
import { css } from "react-emotion";
import { ifNotProp } from "styled-tools";
import { TableView } from "@ehealth/components";
import TableDropDownControll from "./TableDropDownControll";
import TableHeaderCellWithResize from "./TableHeaderCellWithResize";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

type HeaderData = { [string]: string };

type HeaderDataWithStatus = {|
  name: string,
  status: boolean,
  title: string
|};

type AdminTableProps = {|
  data: { value: React.Node },
  header: HeaderData,
  renderRow: { value: React.Node },
  rowKeyExtractor: () => mixed,
  columnKeyExtractor?: () => mixed,
  sortElements: string[],
  onSort: () => mixed,
  sortParams: string[],
  defaultFilter?: (data: HeaderData) => Array<HeaderDataWithStatus | any>
|};

type AdminTableState = {|
  filterRow?: Array<HeaderDataWithStatus | null>
|};

/**
 * @example Use AdminTable
 * ```jsx
 * <LocationParams>
 *   {({
 *     locationParams: { sort = "", ...searchParamsRest },
 *     setLocationParams
 *   }) => {
 *     const [sortBy, orderBy] = sort.split("_");
 *     return (
 *       <AdminTable
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
 *         sortElements={["status", "id"]}
 *         sortParams={{ sortBy, sortEncrease: orderBy === "desc" }}
 *         onSort={({ sortBy, sortEncrease, ...props }) =>
 *           setLocationParams({
 *             ...searchParamsRest,
 *             sort: [sortBy, sortEncrease ? "desc" : "asc"].join("_")
 *           })
 *         }
 *       />
 *     );
 *   }}
 * </LocationParams>
 * ```
 */

class AdminTable extends React.Component<AdminTableProps, AdminTableState> {
  state = {
    filterRow: []
  };

  componentDidMount() {
    const { header, defaultFilter = this.defaultFilter } = this.props;

    this.setState({
      filterRow: defaultFilter(header)
    });
  }

  render() {
    const {
      data,
      header,
      renderRow,
      rowKeyExtractor,
      columnKeyExtractor,
      sortElements,
      onSort,
      sortParams
    } = this.props;
    const { filterRow } = this.state;
    return (
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
          sortElements={sortElements}
          onSort={onSort}
          sortParams={sortParams}
          filterRow={filterRow}
          onFilter={name => {
            const { filterRow = [] } = this.state;
            this.setState({
              filterRow: filterRow.map(
                item =>
                  item && item.name === name
                    ? { ...item, status: !item.status }
                    : item
              )
            });
          }}
        />
      </TableWrapper>
    );
  }

  defaultFilter = (header: HeaderData): Array<HeaderDataWithStatus | any> =>
    Object.entries(header).map(
      ([name, title]) =>
        ({
          name,
          title,
          status: true
        }: HeaderDataWithStatus)
    );
}

export default AdminTable;

const TableWrapper = styled.div`
  width: 100%;
  overflow: scroll;
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
  background-color: #f5f7f9;
  font-size: 10px;
  user-select: none;
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