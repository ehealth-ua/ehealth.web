import React from "react";

import styles from "./styles.module.css";

const DetailMainComponent = props => <div className={styles.main} {...props} />;

export const DetailMain = DetailMainComponent;

const DetailRowComponent = props => <div className={styles.row} {...props} />;

export const DetailRow = DetailRowComponent;

const DetailRowRightComponent = props => (
  <div className={styles.right} {...props} />
);

export const DetailRowRight = DetailRowRightComponent;
