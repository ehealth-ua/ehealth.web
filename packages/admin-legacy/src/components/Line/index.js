import React from "react";

import styles from "./styles.module.css";

const Line = ({ width }) => (
  <hr className={styles.line} style={{ width: `${width}px` }} />
);

export default Line;
