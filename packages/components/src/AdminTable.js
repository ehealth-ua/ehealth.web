import React from "react";
import styled from "@emotion/styled";

import TableView from "./TableView";

type AdminTableProps = {
  data: { value: React.Node },
  header: { value: React.Node },
  renderRow: React.Node,
  rowKeyExtractor: () => mixed,
  columnKeyExtractor: () => mixed
};

const AdminTable = ({
  data,
  header,
  renderRow,
  rowKeyExtractor,
  columnKeyExtractor
}: AdminTableProps) => (
  <TableView
    data={data}
    header={header}
    renderRow={renderRow}
    rowKeyExtractor={rowKeyExtractor}
    columnKeyExtractor={columnKeyExtractor}
    tableComponent={TableRoot}
    headerComponent={TableHeader}
    bodyComponent={TableBody}
    rowComponent={TableRow}
    headerCellComponent={TableHeaderCell}
    cellComponent={TableCell}
  />
);

export default AdminTable;

const TableRoot = styled.table`
  border: 1px solid #e0e0e0;
  border-collapse: collapse;
  color: #3d3d3d;
  font-size: 12px;
  line-height: 20px;
  table-layout: fixed;
  width: 100%;
`;

const TableHeader = styled.thead`
  background-color: #f5f7f9;
  font-size: 10px;
  user-select: none;
`;

const TableBody = styled.tbody`
  background-color: #fff;
`;

const TableRow = styled.tr`
  ${TableBody} & {
    &:nth-child(2n) {
      background-color: #fcfcfc;
    }

    &:hover {
      background-color: #f3fdff;
    }
  }
`;

const TableCell = styled.td`
  border-top: 1px solid #e0e0e0;
  padding: 16px 20px;
  text-align: left;
  vertical-align: middle;
`;

const TableHeaderCell = styled(TableCell.withComponent("th"))`
  color: #929499;
  cursor: default;
  font-weight: 700;
  padding: 14px 20px;
  text-shadow: 1px 1px 2px #fff, 0 0 0 #929499;
  text-transform: uppercase;
`;
