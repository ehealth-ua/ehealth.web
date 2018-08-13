import React from "react";
import classnames from "classnames";
import { CheckRightIcon } from "@ehealth/icons";
import styles from "./styles.module.css";

const ListItem = ({ active, disabled, title, onClick }) => (
  <li
    onClick={onClick}
    className={classnames(active && styles.active, disabled && styles.disabled)}
  >
    {title}
    {active ? (
      <span className={styles.icon}>
        <CheckRightIcon width="10" />
      </span>
    ) : null}
  </li>
);

export default ListItem;
