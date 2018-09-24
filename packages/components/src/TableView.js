import React from "react";

type Props = {
  data: { value: React.Node },
  header: { value: React.Node },
  renderRow: React.Node,
  rowKeyExtractor: () => mixed,
  columnKeyExtractor: () => mixed,
  tableComponent: React.Node,
  headerComponent: React.Node,
  bodyComponent: React.Node,
  rowComponent: React.Node,
  headerCellComponent: React.Node,
  cellComponent: React.Node
};

const TableView = ({
  data,
  header,
  renderRow = item => item,
  rowKeyExtractor = (item, index) => item.key || index,
  columnKeyExtractor = name => name,
  tableComponent: TableComponent = "table",
  tableHeader: TableHeaderView = TableHeader,
  tableBody: TableBodyView = TableBody,
  headerComponent = "thead",
  bodyComponent = "tbody",
  rowComponent = "tr",
  headerCellComponent = "th",
  cellComponent = "td",
  sortableFields,
  sortingParams,
  onSortingChange,
  filterRow = null,
  onFilter
}: Props) => (
  <TableComponent>
    <TableHeaderView
      header={header}
      columnKeyExtractor={columnKeyExtractor}
      headerComponent={headerComponent}
      rowComponent={rowComponent}
      headerCellComponent={headerCellComponent}
      sortableFields={sortableFields}
      sortingParams={sortingParams}
      onSortingChange={onSortingChange}
      filterRow={filterRow}
      onFilter={onFilter}
    />
    <TableBodyView
      columns={Object.keys(header)}
      data={data}
      renderRow={renderRow}
      rowKeyExtractor={rowKeyExtractor}
      columnKeyExtractor={columnKeyExtractor}
      bodyComponent={bodyComponent}
      rowComponent={rowComponent}
      cellComponent={cellComponent}
      filterRow={filterRow}
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
