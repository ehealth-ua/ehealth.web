import React from "react";
import classnames from "classnames";
import styles from "./styles.module.css";

const BackgroundLayout = ({ color = "love" }) => (
  <div className={classnames(styles.bg, styles[`color-${color}`])} />
);

export default BackgroundLayout;
