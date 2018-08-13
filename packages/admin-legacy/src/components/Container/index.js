import React from "react";

import styles from "./styles.module.css";

export const Container = ({ children, id }) => (
  <div id={id} className={styles.main}>
    <div className={styles.main__in}>{children}</div>
  </div>
);

export default Container;
