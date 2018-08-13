import React, { Children } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import styles from "./styles.module.css";

const DEFAULT_PLACEHOLDER = "Немає даних";

const TableRowComponent = ({ columns = [], data = {}, ...rest }) => (
  <tr {...rest}>
    {columns.map(({ key, title, align, colspan, width }) => (
      <td
        data-title={title}
        width={width}
        colSpan={colspan}
        className={align && styles[align]}
        key={key}
      >
        {typeof data[key] !== "undefined" || React.isValidElement(data[key])
          ? data[key]
          : ""}
      </td>
    ))}
  </tr>
);

const TableHeadComponent = ({ columns = [] }) => (
  <thead>
    <tr>
      {columns.map(({ key, title, width, align }) => (
        <th className={align && styles[align]} width={width} key={key}>
          {title}
        </th>
      ))}
    </tr>
  </thead>
);

const TablePlaceholder = ({ colSpan, placeholder }) => (
  <tr className={styles.placeholder}>
    <td colSpan={colSpan}>{placeholder}</td>
  </tr>
);

export const TableRow = TableRowComponent;
export const TableHead = TableHeadComponent;

const Table = props => {
  const {
    columns = [],
    data = [],
    placeholder = DEFAULT_PLACEHOLDER,
    zebra = true,
    responsive = true,
    hovered = true,
    head = true,
    tbody = true,
    keyColumn,
    rowComponent,
    headComponent,
    children = []
  } = props;

  const Head = headComponent || TableHead;
  const Row = rowComponent || TableRow;

  const classNames = classnames(
    styles.table,
    zebra && styles.zebra,
    hovered && styles.hovered,
    responsive && styles.responsive
  );

  let rows = [];

  if (children.length !== 0) {
    rows = Children.map(children, (child, key) =>
      React.cloneElement(child, { columns, key })
    );
  } else {
    rows = data.map((item, key) =>
      React.createElement(Row, {
        columns,
        key: item[keyColumn] || key,
        data: item
      })
    );
  }

  if (rows.length === 0) {
    rows = React.createElement(TablePlaceholder, {
      colSpan: columns.length,
      placeholder
    });
  }

  return (
    <table className={classNames}>
      {head && <Head columns={columns} />}
      {tbody ? <tbody>{rows}</tbody> : rows}
    </table>
  );
};

const columnsType = PropTypes.arrayOf(
  PropTypes.shape({
    key: PropTypes.any.isRequired,
    title: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    align: PropTypes.oneOf(["left", "center", "right"]),
    colspan: PropTypes.number
  })
);

Table.propTypes = {
  columns: columnsType,
  data: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string,
  zebra: PropTypes.bool,
  hovered: PropTypes.bool,
  head: PropTypes.bool,
  tbody: PropTypes.bool,
  rowComponent: PropTypes.func,
  headComponent: PropTypes.func
};

TableHeadComponent.propTypes = {
  columns: columnsType.isRequired
};

TableRowComponent.propTypes = {
  columns: columnsType,
  data: PropTypes.objectOf(PropTypes.any)
};

export default Table;
