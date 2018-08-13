import React from "react";

import styles from "./styles.module.css";

const InlineList = ({ list = [], separator = "," }) => (
  <ul className={styles.list}>
    {list.map((name, i) => (
      <li key={i}>
        {name}
        {i !== list.length - 1 && separator}
      </li>
    ))}
  </ul>
);

export default InlineList;
