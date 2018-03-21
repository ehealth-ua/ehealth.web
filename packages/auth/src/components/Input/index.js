import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import ErrorMessages from "../ErrorMessages";

import styles from "./styles.module.css";

const Prefix = ({ prefix }) => (
  <span className={styles["prefix-wrapper"]}>{prefix}</span>
);

const Postfix = ({ postfix }) => (
  <span className={styles["postfix-wrapper"]}>{postfix}</span>
);

const Input = ({
  children,
  type,
  labelText,
  postfix,
  prefix,
  disabled,
  readOnly,
  required, // eslint-disable-line
  active,
  value,
  error,
  placeholder,
  name,
  onChange,
  onBlur,
  onFocus,
  inputComponent = "input",
  component = inputComponent,
  theme = "gray",
  className, // eslint-disable-line
  ...rest // eslint-disable-line
}) => {
  const decorInputProps = {
    errored: !!error,
    focused: active,
    prefix,
    postfix
  };

  const prefixComp = prefix && <Prefix {...decorInputProps} />;
  const postfixComp = postfix && <Postfix {...decorInputProps} />;

  const inputProps = {
    className: styles.input,
    type,
    disabled,
    placeholder,
    readOnly,
    value,
    name,
    onChange,
    onBlur,
    onFocus
  };

  return (
    <span>
      <label className={styles["label-wrapper"]}>
        {labelText && <div className={styles["label-text"]}>{labelText}</div>}
        <span
          className={classnames(
            styles["group-input"],
            styles[`theme-${theme}`],
            error && styles.error,
            active && !readOnly && styles.active,
            disabled && styles.disabled
          )}
        >
          {prefixComp}
          {React.createElement(component, {
            ...rest,
            ...inputProps
          })}
          {postfixComp}
          {error && (
            <div className={styles["error-label"]}>
              {typeof error === "string" ? (
                error
              ) : (
                <ErrorMessages error={error}>{children}</ErrorMessages>
              )}
            </div>
          )}
        </span>
      </label>
    </span>
  );
};

Input.propTypes = {
  theme: PropTypes.oneOf(["light"])
};

export default Input;
