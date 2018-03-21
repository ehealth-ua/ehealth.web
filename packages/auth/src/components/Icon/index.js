import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./icons.font";

export const icons = [
  "arrow-left",
  "arrow-left-large",
  "arrow-right",
  "arrow-down",
  "check-right",
  "check-left",
  "caret-down",
  "caret-up",
  "caret-left",
  "caret-right",
  "add",
  "doc",
  "trash",
  "nebo15"
];

const Icon = ({ name }) =>
  React.createElement("i", {
    className: classnames(styles.icon, styles[`icon-${name}`])
  });

Icon.propTypes = {
  name: PropTypes.oneOf(icons).isRequired
};

export default Icon;
