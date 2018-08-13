import React from "react";

import styles from "./styles.module.css";

const Upper = ({ children }) => (
  <span className={styles.upper}>{children}</span>
);

export default Upper;
