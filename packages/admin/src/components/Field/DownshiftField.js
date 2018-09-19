import React, { Component } from "react";
import Downshift from "downshift";
import { Field } from "@ehealth/components";

export class MultiDownshift extends Component {
  state = { selectedItems: [] };

  stateReducer = (state, changes) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          isOpen: true
        };
      default:
        return changes;
    }
  };

  handleSelection = (selectedItem, downshift) => {
    const callOnChange = () => {
      if (this.props.onSelect) {
        this.props.onSelect(
          this.state.selectedItems,
          this.getStateAndHelpers(downshift)
        );
      }
      if (this.props.onChange) {
        this.props.onChange(
          this.state.selectedItems,
          this.getStateAndHelpers(downshift)
        );
      }
    };
    if (this.state.selectedItems.includes(selectedItem)) {
      this.removeItem(selectedItem, callOnChange);
    } else {
      this.addSelectedItem(selectedItem, callOnChange);
    }
  };

  removeItem = (item, cb) => {
    this.setState(({ selectedItems }) => {
      return {
        selectedItems: selectedItems.filter(i => i !== item)
      };
    }, cb);
  };
  addSelectedItem(item, cb) {
    this.setState(
      ({ selectedItems }) => ({
        selectedItems: [...selectedItems, item]
      }),
      cb
    );
  }

  getRemoveButtonProps = ({ onClick, item, ...props } = {}) => {
    return {
      onClick: e => {
        onClick && onClick(e);
        e.stopPropagation();
        this.removeItem(item);
      },
      ...props
    };
  };

  getStateAndHelpers(downshift, meta) {
    const { selectedItems } = this.state;
    const { getRemoveButtonProps, removeItem } = this;
    return {
      getRemoveButtonProps,
      removeItem,
      selectedItems,
      meta,
      ...downshift
    };
  }

  componentDidUpdate() {
    this.setValuesToForm(this.state.selectedItems);
  }

  render() {
    const { children, render = children, ...props } = this.props;
    return (
      <Field {...props}>
        {({ input, meta }) => {
          this.setValuesToForm = input.onChange;

          return (
            <Downshift
              {...props}
              stateReducer={this.stateReducer}
              onChange={this.handleSelection}
              selectedItem={this.state.selectedItems}
              render={downshift =>
                render(this.getStateAndHelpers(downshift, meta))
              }
            />
          );
        }}
      </Field>
    );
  }
}

export const SingleDownshift = ({ children, render = children, ...props }) => (
  <Field allowNull {...props}>
    {({ input: { value, onChange, ...input }, ...fieldRenderProps }) => (
      <Downshift
        {...props}
        selectedItem={value}
        onChange={onChange}
        render={downshiftRenderProps =>
          render({ ...downshiftRenderProps, ...fieldRenderProps, input })
        }
      />
    )}
  </Field>
);
