import React, { Component } from "react";
import Button from "../../Button/";
import ErrorMessages from "../../ErrorMessages";

import classnames from "classnames";
import styles from "./styles.module.css";

export default class FieldFileInput extends Component {
  state = {
    fileName: null
  };

  onChange = e => {
    const {
      input: { onChange }
    } = this.props;

    if (e.target.files[0]) this.setState({ fileName: e.target.files[0].name });
    onChange(e.target.files[0]);
  };

  render() {
    const {
      input: { value },
      label,
      required,
      meta: { error, active, touched, warning },
      ...props
    } = this.props;

    const { fileName } = this.state;

    return (
      <div>
        <div>
          <Button size="small" color={touched && error ? "red" : "blue"}>
            <input
              id="file"
              className={styles["file-input"]}
              type="file"
              accept=".csv"
              onChange={this.onChange}
              {...props}
            />
            <label htmlFor="file" className={styles["file-label"]}>
              {label || "Завантажити файл"}
            </label>
          </Button>
          {fileName && (
            <span>
              <b>{` ${fileName}*`}</b>
            </span>
          )}
        </div>
        {touched &&
          error && (
            <div className={styles["file-error"]}>
              {typeof error === "string" ? (
                error
              ) : (
                <ErrorMessages error={error} />
              )}
            </div>
          )}
      </div>
    );
  }
}
