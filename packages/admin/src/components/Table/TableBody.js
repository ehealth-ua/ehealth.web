import React from "react";
import { filterTableColumn } from "@ehealth/utils";

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
}) => (
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
