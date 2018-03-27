import React from "react";

import styles from "./styles.module.css";

export const Main = ({ id, children }) => (
  <section className={styles.main} id={id}>
    {children}
  </section>
);

export const Header = ({ children }) => (
  <header className={styles.header}>{children}</header>
);

export const Article = ({ children }) => (
  <article className={styles.article}>{children}</article>
);
