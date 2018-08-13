import React from "react";

import classnames from "classnames";

import styles from "./styles.module.css";

const ListHeaderComponent = ({ button, children, ...props }) => (
  <div className={styles.header} {...props}>
    {children}
    {button && <div className={styles.header__btn}>{button}</div>}
  </div>
);

export const ListHeader = ListHeaderComponent;

const ListFilterComponent = props => (
  <div className={styles.filter} {...props} />
);

export const ListFilter = ListFilterComponent;

const ListShowByComponent = props => (
  <div className={styles.showBy} {...props} />
);

export const ListShowBy = ListShowByComponent;

const ListTableComponent = props => <div className={styles.table} {...props} />;

export const ListTable = ListTableComponent;

const ListStatusComponent = ({ verified, ...props }) => (
  <span
    className={classnames(styles.status, {
      [styles.status_verified]: verified
    })}
    {...props}
  />
);

export const ListStatus = ListStatusComponent;

const ListPaginationComponent = props => (
  <div className={styles.pagination} {...props} />
);

export const ListPagination = ListPaginationComponent;
