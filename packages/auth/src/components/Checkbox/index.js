import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Icon from "../Icon";

import styles from "./styles.module.css";

/* eslint-disable jsx-a11y/label-has-for */
const Checkbox = ({
  checked = false,
  onChange = e => e,
  onBlur,
  onFocus,
  error,
  name,
  labelText,
  disabled
}) => (
  <label
    className={classnames(
      styles.wrap,
      error && styles.isError,
      checked && styles.checked
    )}
  >
    {
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        {...{
          onBlur,
          onFocus,
          name,
          disabled
        }}
      />
    }
    <span className={styles.view}>
      <Icon name="check-left" />
    </span>

    <span className={styles.label}>{labelText}</span>
  </label>
);

Checkbox.PropTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.any,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func
};

export default Checkbox;

export const CheckboxGroup = ({ children }) => (
  <span className={styles.group}>{children}</span>
);
