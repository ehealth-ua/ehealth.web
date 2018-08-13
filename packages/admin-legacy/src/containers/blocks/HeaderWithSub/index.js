import React from "react";

import { H1 } from "../../../components/Title";
import Line from "../../../components/Line";

import styles from "./styles.module.css";

const HeaderWithSub = ({ title, children }) => (
  <div>
    <H1>{title}</H1>
    <div className={styles.sub}>{children}</div>
    <Line />
  </div>
);

export default HeaderWithSub;
