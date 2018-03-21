import React from "react";
import classnames from "classnames";
import Icon from "../Icon";

import styles from "./styles.module.css";

const Form = props => (
  <form className={classnames(styles.form)} noValidate {...props} />
);
export default Form;

export const FormBlock = ({ children }) => (
  <div className={styles.block}>{children}</div>
);

export const FormRow = props => <div className={styles.row} {...props} />;

export const FormBlockTitle = ({ children, right, ...rest }) => (
  <div className={styles.blockTitle} {...rest}>
    <div className={styles.blockTitle__text}>{children}</div>
    {right && <div className={styles.blockTitle__right}>{right}</div>}
  </div>
);

const sizeToClassName = size => {
  const [part, count] = size.split("/");
  return styles[`column_${part}-${count}`];
};

export const FormColumn = ({ size, align = "top", ...rest }) => (
  <div
    className={classnames(
      styles.column,
      size && sizeToClassName(size),
      align & styles[`column_align-${align}`]
    )}
    {...rest}
  />
);

export const FormButtons = props => (
  <div className={classnames(styles.buttons)} {...props} />
);

export const FormIcon = ({
  icon = "add",
  color = "green",
  children,
  ...rest
}) => (
  <a className={styles.icon} {...rest}>
    <span
      className={classnames(
        styles.icon__symbol,
        color && styles[`icon_color-${color}`]
      )}
    >
      <Icon name={icon} />
    </span>
    <span className={styles.icon__text}>{children}</span>
  </a>
);

export const FormError = props => <div {...props} className={styles.error} />;
