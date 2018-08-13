import React from "react";
import classnames from "classnames";
import styles from "./styles.module.css";

import SelectControlItem from "./SelectControlItem";

const SelectControl = ({
  multiple,
  searchable,
  items = [],
  onRemoveItem,
  error,
  onClick,
  value = "",
  placeholder,
  onEnterItem = () => {},
  onInputRemove = () => {},
  onInputFocus,
  onInputChange = () => {}
}) => (
  <div
    className={classnames(styles.control, error && styles.error)}
    onClick={onClick}
  >
    {(multiple || (!multiple && !searchable)) &&
      !!items.length && (
        <ul
          className={classnames(
            styles.control__selected,
            multiple && styles.control__selected_multiple,
            !multiple && styles.control__selected_multiple_no
          )}
        >
          {items &&
            items.map(item => (
              <SelectControlItem
                title={item.title}
                onRemove={e => {
                  onRemoveItem(item);
                  e.stopPropagation();
                }}
                multiple={multiple}
                key={item.name}
              />
            ))}
        </ul>
      )}
    {searchable && (
      <div
        className={classnames(
          styles.control__input,
          multiple && styles.control__input_multiple,
          !multiple && styles.control__input_multiple_no
        )}
      >
        <input
          autoComplete="off"
          onChange={e => onInputChange(e.target.value)}
          onFocus={onInputFocus}
          placeholder={placeholder}
          value={value}
          // keyDown is using to prevent form submission on enter press
          onKeyDown={e =>
            (e.target.value &&
              e.key === "Enter" &&
              (onEnterItem(e.target.value),
              e.stopPropagation(),
              e.preventDefault())) ||
            (!e.target.value && e.key === "Backspace" && onInputRemove())
          }
        />
      </div>
    )}
    {!searchable &&
      (!items || items.length === 0) && (
        // show placeholder for control without search input
        <div className={styles.control__placeholder}>{placeholder}</div>
      )}
    {!searchable && (
      // enable tab index for selects without search input
      <input onFocus={onInputFocus} className={styles.hiddenInput} />
    )}
  </div>
);

export default SelectControl;
