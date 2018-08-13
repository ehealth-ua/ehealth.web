import React from "react";

import classnames from "classnames";

import { AddIcon } from "@ehealth/icons";

import styles from "./styles.module.css";

const FormComponent = props => (
  <form className={classnames(styles.form)} noValidate {...props} />
);

export default FormComponent;

const FormBlockComponent = ({ title, children, border, ...rest }) => (
  <div
    className={classnames(styles.block, border && styles.block_border)}
    {...rest}
  >
    {title && <FormBlockTitle>{title}</FormBlockTitle>}
    <div className={styles.block__content}>{children}</div>
  </div>
);

export const FormBlock = FormBlockComponent;

const FormRowComponent = props => <div className={styles.row} {...props} />;

export const FormRow = FormRowComponent;

const FormBlockTitleComponent = ({ children, right, ...rest }) => (
  <div className={styles.blockTitle} {...rest}>
    <div className={styles.blockTitle__text}>{children}</div>
    {right && <div className={styles.blockTitle__right}>{right}</div>}
  </div>
);

export const FormBlockTitle = FormBlockTitleComponent;

const sizeToClassName = size => {
  const [part, count] = size.split("/");
  return styles[`column_${part}-${count}`];
};

const FormColumnComponent = ({ size, align = "top", ...rest }) => (
  <div
    className={classnames(
      styles.column,
      size && sizeToClassName(size),
      align && styles[`column_align-${align}`]
    )}
    {...rest}
  />
);

export const FormColumn = FormColumnComponent;

const FormButtonsComponent = props => (
  <div className={classnames(styles.buttons)} {...props} />
);

export const FormButtons = FormButtonsComponent;

const FormIconComponent = ({
  icon: Icon = AddIcon,
  color = "green",
  children,
  ...rest
}) => (
  <a className={styles.icon} {...rest}>
    <Icon
      className={classnames(
        styles.icon__symbol,
        color && styles[`icon_color-${color}`]
      )}
    />
    <span className={styles.icon__text}>{children}</span>
  </a>
);

export const FormIcon = FormIconComponent;

const FormErrorComponent = props => <div {...props} className={styles.error} />;

export const FormError = FormErrorComponent;
