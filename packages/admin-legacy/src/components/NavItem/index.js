import React from "react";
import PropTypes from "prop-types";

export default class NavItem extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  render() {
    const { router } = this.context;
    const { onlyActiveOnIndex, to, children, activeClassName } = this.props;

    const isActive = router.isActive(to, onlyActiveOnIndex);
    return <li className={isActive ? activeClassName : ""}>{children}</li>;
  }
}
