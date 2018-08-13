import React, { Component } from "react";
import { compose } from "redux";
import classnames from "classnames";
import { withRouter } from "react-router";

import styles from "./styles.module.css";

class ShowBy extends Component {
  static defaultProps = {
    counts: ["5", "20", "50"]
  };

  state = {
    page_size: this.props.location.query.page_size || "5"
  };

  render() {
    const { counts } = this.props;
    const { page_size } = this.state;

    return (
      <div className={styles.main}>
        <span className={styles.text}>Показати по</span>
        {counts.map(count => (
          <button
            key={count}
            onClick={() => this.updateFilter(count)}
            className={classnames(styles.button, {
              [styles.button_active]: page_size === count
            })}
          >
            {count}
          </button>
        ))}
      </div>
    );
  }

  updateFilter(page_size) {
    const { location: { query, ...location }, router } = this.props;

    this.setState({ page_size });

    router.push({
      ...location,
      query: { ...query, page_size, page: 1 }
    });
  }
}

export default compose(withRouter)(ShowBy);
