import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import classnames from "classnames";

import styles from "./styles.module.css";

const URL_TEST_REG_EXP = /^((?:[a-z]+:)?\/\/)|mailto:/i;

const Button = props => {
  const {
    theme = "fill",
    size = "middle",
    color = "orange",
    active = false,
    disabled = false,
    block = false,
    inheritColor = false,
    type = "button",
    to,
    children,
    onClick,
    id,
    icon,
    name,
    ...rest
  } = props;

  const className = classnames(
    styles.button,
    styles[`theme-${theme}`],
    styles[`color-${color}`],
    styles[`size-${size}`],
    active && styles.active,
    disabled && styles.disabled,
    block && styles.block,
    inheritColor && styles["inherit-color"]
  );

  const content = (
    <div>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </div>
  );

  if (to === undefined) {
    return (
      <button
        name={name}
        id={id}
        onClick={onClick}
        type={type}
        className={className}
        {...rest}
      >
        {content}
      </button>
    );
  }
  if (URL_TEST_REG_EXP.test(to)) {
    return (
      <a id={id} href={to} onClick={onClick} className={className} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <Link id={id} to={to} onClick={onClick} className={className} {...rest}>
      {content}
    </Link>
  );
};

Button.propTypes = {
  theme: PropTypes.oneOf(["fill", "border", "link"]),
  size: PropTypes.oneOf(["small", "middle"]),
  color: PropTypes.oneOf(["orange", "blue", "green", "red"]),
  type: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  inheritColor: PropTypes.bool,
  to: PropTypes.string,
  id: PropTypes.string,
  // icon: PropTypes.element,
  onClick: PropTypes.func
};

export default Button;
export const ButtonsGroup = ({ children, ...props }) => (
  <div {...props} className={styles.buttonsGroup}>
    {React.Children.toArray(children).map((i, key) => (
      <div className={styles.buttonsGroupItem} key={key}>
        {i}
      </div>
    ))}
  </div>
);
