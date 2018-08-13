import React from "react";

import styles from "./styles.module.css";

const BlocksList = ({ children }) => (
  <ul className={styles.list}>{children}</ul>
);

export default BlocksList;
