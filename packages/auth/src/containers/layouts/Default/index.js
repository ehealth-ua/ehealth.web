import React from "react";

import styles from "./styles.module.css";

const Default = ({ children }) => (
  <div>
    <header className={styles.header}>
      <a className={styles.logo} href="/">
        <img src="/images/logo.svg" alt="Logo" />
      </a>
    </header>
    {children}
  </div>
);

export default Default;
