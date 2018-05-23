import React from "react";
import PropTypes from "prop-types";
import { Link as LinkV4 } from "react-router-dom";
import { Link as LinkV3 } from "react-router";

const RouterLink = (props, context) => {
  const Link = typeof context.router.route === "object" ? LinkV4 : LinkV3;

  return <Link {...props} />;
};

RouterLink.contextTypes = {
  router: PropTypes.object
};

export default RouterLink;
