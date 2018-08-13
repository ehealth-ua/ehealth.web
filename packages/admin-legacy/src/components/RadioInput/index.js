import React from "react";
import PropTypes from "prop-types";

import styles from "./styles.module.css";

export const RadioInput = ({
  selected = false,
  onChange = e => e,
  disabled,
  value,
  name,
  children
}) => (
  <label className={styles.wrap}>
    <input
      type="radio"
      {...{
        onChange: () => !disabled && onChange(value),
        checked: selected,
        value,
        name,
        disabled
      }}
    />
    <span className={styles.view} />
    <span className={styles.label}>{children}</span>
  </label>
);

RadioInput.PropTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.isRequired,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  onChange: PropTypes.func
};

export default RadioInput;
