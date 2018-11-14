import React from "react";
import { compose } from "redux";
import { Link } from "react-router";
import { connect } from "react-redux";
import { EhealthLogoIcon } from "@ehealth/icons";

import Nav from "../Nav";
import Gamburger from "../Gamburger";

import { toggleMenu } from "./redux";

import styles from "./styles.module.css";

class Aside extends React.Component {
  render() {
    const { active, toggleMenu } = this.props;
    return (
      <aside className={styles.aside}>
        <Link className={styles.logo} to="/">
          <EhealthLogoIcon width={75} />
        </Link>

        <Nav isOpen={active} />

        <div className={styles["menu-control"]}>
          <Gamburger isOpen={active} onToggle={toggleMenu} />
        </div>
      </aside>
    );
  }
}

export default compose(
  connect(
    state => state.blocks.Aside,
    { toggleMenu }
  )
)(Aside);
