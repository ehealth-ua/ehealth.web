import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { H2 } from "../Title";
import Button from "../Button";

import styles from "./styles.module.css";

const DEFAULT_CONFIRM_BTN_TEXT = "Confirm";
const DEFAULT_CANCEL_BTN_TEXT = "Cancel";
const DEFAULT_ALERT_BTN_TEXT = "Done";

const THEMES_COLOR = {
  error: "red",
  success: "blue"
};

const PopupComponent = ({
  children,
  title,
  active = false,
  theme,
  onClose,
  bgCloser = true,
  id
}) => (
  <section
    id={id}
    className={classnames(
      styles.popup,
      active && styles.active,
      theme && styles[`theme-${theme}`]
    )}
  >
    <div className={styles.content}>
      {title && (
        <header className={styles.header}>
          <H2 color={THEMES_COLOR[theme]}>{title}</H2>
        </header>
      )}
      {children}
    </div>
    {bgCloser && <div className={styles.closer} onClick={onClose} />}
  </section>
);

PopupComponent.propTypes = {
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  active: PropTypes.bool,
  theme: PropTypes.oneOf(["error", "success"]),
  onClose: PropTypes.func,
  bgCloser: PropTypes.bool,
  id: PropTypes.string
};

PopupComponent.defaultProps = {
  active: false,
  bgCloser: true
};

const AlertComponent = props => {
  const {
    children,
    title,
    ok = DEFAULT_ALERT_BTN_TEXT,
    theme,
    active,
    onClose
  } = props;

  return (
    <Popup active={active} title={title} theme={theme} bgCloser={false}>
      <article>{children}</article>
      <footer>
        <Button onClick={onClose}>{ok}</Button>
      </footer>
    </Popup>
  );
};

AlertComponent.propTypes = {
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  ok: PropTypes.string,
  active: PropTypes.bool,
  theme: PropTypes.oneOf(["error", "success"]),
  onClose: PropTypes.func
};

AlertComponent.defaultProps = {
  active: false,
  ok: DEFAULT_ALERT_BTN_TEXT
};

const ConfirmComponent = props => {
  const {
    confirm = DEFAULT_CONFIRM_BTN_TEXT,
    cancel = DEFAULT_CANCEL_BTN_TEXT,
    title,
    theme,
    active,
    children,
    onCancel,
    onConfirm,
    id
  } = props;

  return (
    <Popup id={id} active={active} title={title} theme={theme} bgCloser={false}>
      <article>{children}</article>
      <footer>
        <Button name="popup-confirm-cancel" theme="border" onClick={onCancel}>
          {cancel}
        </Button>
        <Button name="popup-confirm-ok" onClick={onConfirm}>
          {confirm}
        </Button>
      </footer>
    </Popup>
  );
};

ConfirmComponent.propTypes = {
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  confirm: PropTypes.string,
  cancel: PropTypes.string,
  active: PropTypes.bool,
  theme: PropTypes.oneOf(["error", "success"]),
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
};

ConfirmComponent.defaultProps = {
  active: false,
  confirm: DEFAULT_CONFIRM_BTN_TEXT,
  cancel: DEFAULT_CANCEL_BTN_TEXT
};

export const Popup = PopupComponent;
export const Alert = AlertComponent;
export const Confirm = ConfirmComponent;
