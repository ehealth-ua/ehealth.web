import React from "react";

const TableView = ({
  data,
  header,
  renderRow = item => item,
  rowKeyExtractor = (item, index) => item.key || index,
  columnKeyExtractor = (name, index) => name,
  tableComponent: TableComponent = "table",
  headerComponent = "thead",
  bodyComponent = "tbody",
  rowComponent = "tr",
  headerCellComponent = "th",
  cellComponent = "td"
}) => (
  <TableComponent>
    <TableHeader
      header={header}
      columnKeyExtractor={columnKeyExtractor}
      headerComponent={headerComponent}
      rowComponent={rowComponent}
      headerCellComponent={headerCellComponent}
    />
    <TableBody
      columns={Object.keys(header)}
      data={data}
      renderRow={renderRow}
      rowKeyExtractor={rowKeyExtractor}
      columnKeyExtractor={columnKeyExtractor}
      bodyComponent={bodyComponent}
      rowComponent={rowComponent}
      cellComponent={cellComponent}
    />
  </TableComponent>
);

export default TableView;

const TableHeader = ({
  header,
  columnKeyExtractor,
  headerComponent: HeaderComponent,
  rowComponent: RowComponent,
  headerCellComponent: HeaderCellComponent
}) => (
  <HeaderComponent>
    <RowComponent>
      {Object.entries(header).map(([name, content], index) => (
        <HeaderCellComponent key={columnKeyExtractor(name, index)}>
          {content}
        </HeaderCellComponent>
      ))}
    </RowComponent>
  </HeaderComponent>
);

const TableBody = ({
  columns,
  data,
  renderRow,
  rowKeyExtractor,
  columnKeyExtractor,
  bodyComponent: BodyComponent,
  rowComponent: RowComponent,
  cellComponent: CellComponent
}) => (
  <BodyComponent>
    {data.map((item, index) => {
      const row = renderRow(item, index);
      return (
        <RowComponent key={rowKeyExtractor(item, index)}>
          {columns.map((name, index) => (
            <CellComponent key={columnKeyExtractor(name, index)}>
              {row[name]}
            </CellComponent>
          ))}
        </RowComponent>
      );
    })}
  </BodyComponent>
);
