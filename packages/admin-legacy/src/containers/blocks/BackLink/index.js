import React from "react";
import classnames from "classnames";
import { Link } from "react-router";

import { BackIcon } from "@ehealth/icons";

import styles from "./styles.module.css";

const BackLink = ({
  children,
  to,
  iconPosition = "left",
  detached,
  onClick
}) => (
  <div
    className={classnames(styles.back, styles[`back_icon_${iconPosition}`], {
      [styles.back_detached]: detached
    })}
  >
    <Link onClick={onClick} to={to}>
      <span className={styles.back__icon}>
        <BackIcon width="34" height="20" />
      </span>
      <div className={styles.back__content}>{children}</div>
    </Link>
  </div>
);

export default BackLink;
