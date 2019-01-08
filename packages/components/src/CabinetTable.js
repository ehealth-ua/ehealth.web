import React from "react";
import styled from "@emotion/styled";
import TableView from "./TableView";

type CabinetTableProps = {
  data: { value: React.Node },
  header: { value: React.Node },
  renderRow: React.Node,
  rowKeyExtractor: () => mixed,
  columnKeyExtractor: () => mixed
};

const CabinetTable = ({
  data,
  header,
  renderRow,
  rowKeyExtractor,
  columnKeyExtractor
}: CabinetTableProps) => (
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

export default CabinetTable;

const TableRoot = styled.table`
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
`;

const TableHeader = styled.thead`
  font-size: 14px;
  user-select: none;
`;

const TableBody = styled.tbody`
  background-color: #fff;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e7e7e9;
`;

const TableCell = styled.td`
  font-size: 14px;
  line-height: 18px;
  padding: 17px 10px;
  text-align: left;
`;

const TableHeaderCell = styled(TableCell.withComponent("th"))`
  color: #2d2e39;
  cursor: default;
  font-weight: 700;
  padding: 14px 10px;
  text-transform: uppercase;
`;
