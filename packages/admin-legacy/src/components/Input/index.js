import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import ErrorMessages from "../ErrorMessages";
import ColoredText from "../ColoredText";

import styles from "./styles.module.css";

const Prefix = ({ prefix }) => (
  <span className={styles["prefix-wrapper"]}>{prefix}</span>
);

const Postfix = ({ postfix }) => (
  <span className={styles["postfix-wrapper"]}>{postfix}</span>
);

export const Input = ({
  children,
  type,
  labelText,
  postfix,
  prefix,
  disabled,
  readOnly,
  required,
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
  label_bold,
  requiredStar = false,
  className,
  ...rest
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
      <label
        className={styles["label-wrapper"]}
        onClick={e => e.preventDefault()}
      >
        {labelText && (
          <div
            className={classnames(
              styles["label-text"],
              label_bold && styles["label-bold"]
            )}
          >
            {labelText}
            {requiredStar && <ColoredText color="red">*</ColoredText>}
          </div>
        )}
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
            // // TODO: check Input
            // ...rest,
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
  theme: PropTypes.oneOf(["light", "disabled"])
};

export default Input;
