import React from "react";

import styles from "./styles.module.css";

const Main = ({ children }) => (
  <div className={styles.main}>
    <main>{children}</main>
    <footer className={styles.footer}>
      ©{new Date().getFullYear()} Всі права захищені
    </footer>
  </div>
);
export default Main;
