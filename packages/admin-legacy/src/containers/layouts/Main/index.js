import React from "react";

import Aside from "../../blocks/Aside";

import styles from "./styles.module.css";

const Main = ({ children }) => (
  <div className={styles.main}>
    <main>
      <Aside />
      <div className={styles.content}>{children}</div>
    </main>
    <footer className={styles.footer} />
  </div>
);

export default Main;
