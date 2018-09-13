//@flow
import * as React from "react";
import { filterTableColumn } from "@ehealth/utils";

type HeaderDataWithStatus = {|
  name: string,
  status: boolean,
  title: string
|};

type TableBodyType = {
  columns: string[],
  data: string[],
  renderRow: (string, number) => Object,
  rowKeyExtractor: (string, number) => string,
  columnKeyExtractor: (string, number) => string,
  bodyComponent: React.ElementType,
  rowComponent: React.ElementType,
  cellComponent: React.ElementType,
  filterTableColumn: (Array<HeaderDataWithStatus | any>, any) => mixed,
  filterRow: Array<HeaderDataWithStatus | any>
};
const TableBody = ({
  columns,
  data,
  renderRow,
  rowKeyExtractor,
  columnKeyExtractor,
  bodyComponent: BodyComponent,
  rowComponent: RowComponent,
  cellComponent: CellComponent,
  filterTableColumn = filterTableColumn,
  filterRow
}: TableBodyType) => (
  <BodyComponent>
    {data.map((item, index) => {
      const row = renderRow(item, index);
      return (
        <RowComponent key={rowKeyExtractor(item, index)}>
          {columns
            .filter(bodyName => filterTableColumn(filterRow, bodyName))
            .map((name, index, array) => (
              <CellComponent
                key={columnKeyExtractor(name, index)}
                colSpan={array.length - 1 === index && filterRow ? "2" : null}
                whiteSpaceNoWrap={
                  typeof row[name] === "string" && row[name].includes(" ")
                }
              >
                {row[name]}
              </CellComponent>
            ))}
        </RowComponent>
      );
    })}
  </BodyComponent>
);

export default TableBody;