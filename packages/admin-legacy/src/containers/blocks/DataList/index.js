import React from "react";

import styles from "./styles.module.css";

const DataList = ({ list = [] }) => (
  <dl className={styles.list}>
    {list.reduce(
      (arr, item, index) =>
        arr.concat([
          <dt key={`dt-${index}`}>{item.name}</dt>,
          <dd key={`dd-${index}`}>{item.value}</dd>
        ]),
      []
    )}
  </dl>
);

export default DataList;
