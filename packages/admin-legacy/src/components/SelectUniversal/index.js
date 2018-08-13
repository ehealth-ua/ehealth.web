import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { ErrorMessages } from "react-nebo15-validate";
import findFn from "lodash/find";

import OuterClick from "../OuterClick";
import List from "./List";
import SelectControl from "./SelectControl";

import styles from "./styles.module.css";

const LIST_HEIGHT_PADDING = 32;

export class SelectUniversal extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      onChange: PropTypes.func,
      onBlur: PropTypes.func,
      onFocus: PropTypes.func,
      value: PropTypes.any
    }),
    meta: PropTypes.shape({
      active: PropTypes.object,
      error: PropTypes.any
    }),

    /**
     * Label text
     */
    labelText: PropTypes.string,

    /**
     * Empty text when search does not get any matches
     */
    emptyText: PropTypes.string,

    /**
     * Flag for disabling Select
     */
    disabled: PropTypes.bool,

    /**
     * Flag for adding ability to select multiple option using tag
     */
    multiple: PropTypes.bool,

    /**
     * Flag for adding ability to search option using tag
     */
    searchable: PropTypes.bool,

    /**
     * Input placeholder when search select
     */
    placeholder: PropTypes.string,

    /**
     * Callback function for filtering option items in select
     */
    onChangeSearch: PropTypes.func,

    /**
     * Flag for adding ability to add new item if it's in options, must be in search and multiple
     */
    allowAddItem: PropTypes.bool,

    /**
     * Callback function for add new item
     */
    onAddNewItem: PropTypes.func,

    /**
     * Array of objects to be shown in select
     */
    options: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        disabled: PropTypes.bool
      })
    ).isRequired
  };

  static defaultProps = {
    input: {
      value: "",
      onChange: () => {}
    },
    meta: {
      error: {}
    }
  };

  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.onControlClick = this.onControlClick.bind(this);
    this.onFocus = this.onFocus.bind(this);

    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.onInputRemove = this.onInputRemove.bind(this);

    this.state = {
      value: "",
      open: false
    };
  }

  onInputChange(value) {
    this.setState({
      value,
      open: true
    });
    !this.props.meta.active && this.props.input.onFocus();
    this.props.onChangeSearch && this.props.onChangeSearch(value);
  }
  onInputRemove() {
    if (!this.props.multiple) return false;
    const value = this.value;
    return this.onSelect(value[value.length - 1]);
  }
  onControlClick() {
    !this.props.meta.active && this.props.input.onFocus();
    this.setState({
      open: !this.state.open
    });
  }
  onFocus() {
    this.props.input.onFocus();
  }
  onSelect(item, isBlur) {
    const { multiple, searchable, onChangeSearch } = this.props;
    const newState = {};

    const value = this.value;
    const isSelected = this.isSelected(item);
    const newValue = isSelected
      ? value.filter(i => i.name !== item.name)
      : [...value, item];

    if (searchable && !multiple) {
      // item title is displaying in input
      newState.value = item.title;
    }

    if (searchable && multiple) {
      newState.value = "";
      onChangeSearch && onChangeSearch("");
    }

    if (isSelected && item.title === this.state.value) {
      newState.value = "";
    }

    if (isBlur || !multiple) {
      newState.open = false;
    }

    this.changeValue(
      multiple ? newValue : newValue[newValue.length - 1],
      isBlur !== false ? !multiple : isBlur
    );
    this.setState(newState);
  }

  onRemove(item) {
    this.changeValue(this.value.filter(i => i.name !== item.name), true);
  }

  onOuterClick() {
    this.setState({
      open: false
    });
    this.props.input.onBlur(this.props.input.value);
  }

  changeValue(value, isBlur) {
    return this.props.input[isBlur ? "onBlur" : "onChange"](value || "");
  }

  isSelected(item) {
    return findFn(this.value || [], { name: item.name });
  }

  get value() {
    const value = this.props.input.value;
    return value ? (Array.isArray(value) ? value : [value]) : value;
  }

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

  render() {
    const {
      options = [],
      meta: { submitFailed, error, active, dirty },
      placeholder,
      disabled,
      labelText,
      multiple,
      searchable,
      emptyText = "Not found",
      allowAddItem,
      onAddNewItem,
      label_bold,
      children
    } = this.props;

    const isErrored = (submitFailed || (dirty && !active)) && error;

    const classNames = classnames(
      styles.select,
      this.state.open && styles[this.position],
      this.state.open && styles.open,
      active && styles.active,
      disabled && styles.disabled,
      isErrored && styles.error
    );

    const value = this.value;
    return (
      <section ref={ref => (this.selectNode = ref)} className={classNames}>
        <div
          className={classnames(styles.label, label_bold && styles.label__bold)}
        >
          {labelText}
        </div>
        <OuterClick
          onClick={() => (this.state.open || active) && this.onOuterClick()}
        >
          <div>
            <div className={styles.wrap}>
              <SelectControl
                multiple={multiple}
                searchable={searchable}
                items={value}
                onClick={this.onControlClick}
                placeholder={placeholder}
                onRemoveItem={this.onRemove}
                onInputChange={this.onInputChange}
                onInputFocus={this.onFocus}
                value={this.state.value}
                onInputRemove={this.onInputRemove}
                onEnterItem={value =>
                  allowAddItem &&
                  (this.onSelect(
                    { title: value, name: Math.random() % 1000000 + 1 },
                    false
                  ),
                  onAddNewItem && onAddNewItem(value))
                }
              />
              {isErrored && (
                <div className={styles["error-label"]}>
                  {typeof error === "string" ? (
                    error
                  ) : (
                    <ErrorMessages error={error}>{children}</ErrorMessages>
                  )}
                </div>
              )}
              <span className={styles.arrow} />
            </div>
            <div ref={ref => (this.listNode = ref)}>
              <List
                options={options}
                onClickItem={this.onSelect}
                emptyText={emptyText}
                open={this.state.open}
                isActiveItem={this.isSelected}
              />
            </div>
          </div>
        </OuterClick>
      </section>
    );
  }
}

export default SelectUniversal;
