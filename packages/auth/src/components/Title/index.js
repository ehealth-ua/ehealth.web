import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import styles from "./styles.module.css";

const TITLE_TYPES = ["h1", "h2", "h3", "h4", "h5", "h5", "h6", "section"];
const TITLE_TRANSFORM = ["uppercase", "capitalize", "lowercase", "initial"];

export const Title = ({
  type = "h1",
  tag = "h3",
  children,
  color,
  textTransform = "uppercase"
}) => {
  if (TITLE_TYPES.indexOf(type) === -1) {
    throw new Error(`Unknown title type '${type}'`);
  }
  return React.createElement(
    tag,
    {
      className: classnames(
        styles[type],
        color && styles[`color-${color}`],
        textTransform && styles[`textTransform-${textTransform}`]
      )
    },
    children
  );
};

Title.propTypes = {
  type: PropTypes.oneOf(TITLE_TYPES),
  tag: PropTypes.oneOf(TITLE_TYPES),
  textTransform: PropTypes.oneOf(TITLE_TRANSFORM),
  color: PropTypes.string
};

export const H1 = ({ children, tag = "h1", color, textTransform }) =>
  React.createElement(
    Title,
    { type: "h1", tag, color, textTransform },
    children
  );
export const H2 = ({ children, tag = "h2", color, textTransform }) =>
  React.createElement(
    Title,
    { type: "h2", tag, color, textTransform },
    children
  );
export const H3 = ({ children, tag = "h3", color, textTransform }) =>
  React.createElement(
    Title,
    { type: "h3", tag, color, textTransform },
    children
  );
export const H4 = ({ children, tag = "h4", color, textTransform }) =>
  React.createElement(
    Title,
    { type: "h4", tag, color, textTransform },
    children
  );
export const H5 = ({ children, tag = "h5", color, textTransform }) =>
  React.createElement(
    Title,
    { type: "h5", tag, color, textTransform },
    children
  );
export const H6 = ({ children, tag = "h6", color, textTransform }) =>
  React.createElement(
    Title,
    { type: "h6", tag, color, textTransform },
    children
  );

export const SectionTitle = ({ children }) => (
  <Title type="section" tag="h3">
    {children}
  </Title>
);
