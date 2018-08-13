import React from "react";
import { Link } from "react-router";
import classnames from "classnames";

import { ArrowRightIcon, ArrowLeftIcon } from "@ehealth/icons";

import styles from "./styles.module.css";

const CursorPagination = ({ location, after = null, before = null, more }) => (
  <div className={styles.paging}>
    <div
      className={classnames(
        styles.paging__item,
        ((!location.query.ending_before && !location.query.starting_after) ||
          !before) &&
          styles.paging__item_disabled
      )}
    >
      <Link
        to={{
          pathname: location.pathname,
          query: {
            ...location.query,
            ending_before: before,
            starting_after: undefined
          }
        }}
      >
        <ArrowLeftIcon />
      </Link>
    </div>
    <div
      className={classnames(
        styles.paging__item,
        !more && styles.paging__item_disabled
      )}
    >
      <Link
        to={{
          pathname: location.pathname,
          query: {
            ...location.query,
            starting_after: after,
            ending_before: undefined
          }
        }}
      >
        <ArrowRightIcon />
      </Link>
    </div>
  </div>
);

export default CursorPagination;
