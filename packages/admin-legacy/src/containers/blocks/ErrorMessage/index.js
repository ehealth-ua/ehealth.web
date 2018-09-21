import React from "react";

import { connect } from "react-redux";
import Portal from "react-portal";
import { CloseIcon } from "@ehealth/icons";

import { dismissError } from "../../../redux/error";

import ShowMore from "../ShowMore";

import { H3, H5 } from "../../../components/Title";

import styles from "./styles.module.css";

const ErrorMessage = ({
  isErrored,
  error: { message, invalid },
  dismissError
}) => (
  <Portal isOpened={isErrored} onClose={dismissError} closeOnEsc>
    <div className={styles.root}>
      <H3>An error has occured</H3>
      <span className={styles.close}>
        <CloseIcon width="15" height="15" onClick={dismissError} />
      </span>
      <p className={styles.message}>{message}</p>
      {invalid && (
        <ShowMore name="Details" show_block>
          {invalid.map(({ entry, rules }) => (
            <div key={entry} className={styles.error}>
              <H5>{entry}</H5>
              <ul>
                {rules.map(({ rule, description }, index) => (
                  <li key={index}>
                    {rule}: {description}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ShowMore>
      )}
    </div>
  </Portal>
);

export default connect(
  ({ error }) => ({
    isErrored: !!error,
    error: error || {}
  }),
  { dismissError }
)(ErrorMessage);
