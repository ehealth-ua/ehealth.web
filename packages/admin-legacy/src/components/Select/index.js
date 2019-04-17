import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { CheckRightIcon } from "@ehealth/icons";
import OuterClick from "../OuterClick";
import ErrorMessages from "../ErrorMessages";

import styles from "./styles.module.css";

const LIST_HEIGHT_PADDING = 32;

class Select extends React.Component {
  static propTypes = {
    active: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    labelText: PropTypes.string,
    labelBold: PropTypes.bool,
    open: PropTypes.bool,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        disabled: PropTypes.bool
      })
    ).isRequired,
    onChange: PropTypes.func
  };

  static defaultProps = {
    open: false,
    multiple: false
  };

  state = {
    open: this.props.open,
    active: []
  };

  componentWillMount() {
    this.props.active && this.setState({ active: [this.props.active] });
  }

  // FIXME: This is very poor workaround. This component should be controlled or
  // uncontrolled but not both simultaneously
  componentWillReceiveProps(nextProps) {
    if (nextProps.active !== this.props.active) {
      this.setState({ active: nextProps.active && [nextProps.active] });
    }
  }

  onSelect(name) {
    if (this.props.multiple) {
      const active = Array.isArray(this.state.active) ? this.state.active : [];

      if (~active.indexOf(name)) {
        active.splice(active.indexOf(name), 1);
      } else {
        active.push(name);
      }

      this.setState({ active, open: false });

      this.props.onChange && this.props.onChange(active);

      return;
    }

    this.setState({ active: [name], open: false });
    this.props.onChange && this.props.onChange(name);
  }

  /**
   * Calculate open drop down popup position
   * @returns {String<'top'|'bottom'>}
   */
  get position() {
    if (!this.selectNode) {
      return "bottom";
    }

    const selectSize = this.selectNode.getBoundingClientRect();
    const screenHeight = document.documentElement.clientHeight;
    const selectHeight = this.listNode.clientHeight;

    if (screenHeight - selectSize.bottom > selectHeight + LIST_HEIGHT_PADDING) {
      return "bottom";
    }

    return "top";
  }

  get value() {
    return this.state.active;
  }

  render() {
    const {
      options = [],
      placeholder,
      disabled,
      labelText,
      labelBold = false,
      multiple,
      error,
      children
    } = this.props;

    const activeItem = this.state.active || [];
    const classNames = classnames(
      styles.select,
      this.state.open && styles[this.position],
      this.state.open && styles.open,
      disabled && styles.disabled,
      multiple && styles.multiple
    );
    if (!options.length) return null;
    return (
      <OuterClick onClick={() => this.setState({ open: false })}>
        <section ref={ref => (this.selectNode = ref)} className={classNames}>
          {labelText && (
            <div className={styles.label}>
              {labelBold ? <b>{labelText}</b> : { labelText }}
            </div>
          )}
          <span className={classnames(error && styles.error)}>
            {error && (
              <div className={styles["error-label"]}>
                {typeof error === "string" ? (
                  error
                ) : (
                  <ErrorMessages error={error}>{children}</ErrorMessages>
                )}
              </div>
            )}
          </span>
          <div
            onClick={() => this.setState({ open: !this.state.open })}
            className={classnames(styles.control, error && styles.error)}
          >
            {multiple || (
              <div>
                <span hidden={activeItem.length} className={styles.placeholder}>
                  {placeholder}
                </span>
                {activeItem.length ? (
                  <span hidden={!activeItem.length}>
                    {
                      options.filter(({ name }) => name === activeItem[0])[0]
                        .title
                    }
                  </span>
                ) : null}
              </div>
            )}
            {multiple && (
              <div>
                {activeItem.length ? (
                  <ul className={styles["multiple-list"]}>
                    {activeItem.map(name => (
                      <li key={`${name}-key`}>{name}</li>
                    ))}
                  </ul>
                ) : (
                  <span className={styles.placeholder}>{placeholder}</span>
                )}
              </div>
            )}
            <span className={styles.arrow} />
          </div>
          <ul ref={ref => (this.listNode = ref)} className={styles.list}>
            {options.map(item => (
              <li
                onClick={() => !item.disabled && this.onSelect(item.name)}
                className={classnames(
                  (activeItem.length
                    ? ~activeItem.indexOf(item.name)
                    : item.name === activeItem.name) && styles.active,
                  item.disabled && styles.disabled
                )}
                key={item.name}
              >
                {item.title}
                {(activeItem.length ? (
                  ~activeItem.indexOf(item.name)
                ) : (
                  item.name === activeItem.name
                )) ? (
                  <span className={styles.icon}>
                    <CheckRightIcon width="10" />
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </OuterClick>
    );
  }
}

export default Select;
