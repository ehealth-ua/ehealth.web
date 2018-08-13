import React from "react";
import PropTypes from "prop-types";

import { H1 } from "../../../components/Title";

import styles from "./styles.module.css";
import { BackIcon } from "@ehealth/icons";

class FormPageWrapper extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  goBack() {
    if (this.props.back) {
      this.context.router.push(this.props.back);
    } else {
      this.context.router.goBack();
    }
  }

  render() {
    const { title, children, back, ...props } = this.props;

    return (
      <div {...props}>
        <H1>
          <span onClick={() => this.goBack()} className={styles.back}>
            <BackIcon width="34" height="20" />
          </span>
          <span className={styles.title}>{title}</span>
        </H1>
        {children}
      </div>
    );
  }
}

export default FormPageWrapper;
