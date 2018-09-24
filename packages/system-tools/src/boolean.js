import { util } from "styled-system";
import PropTypes from "prop-types";

import mixed from "./mixed";

const boolean = ({ prop, key, ...styles }) => {
  const fn = props =>
    mixed(props[prop] ? util.get(props.theme, key) || styles : null);

  fn.propTypes = {
    [prop]: PropTypes.boolean
  };

  return fn;
};

export default boolean;
