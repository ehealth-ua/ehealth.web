import React, { Component } from "react";
import { Field } from "@ehealth/components";

import { Wrapper, Option, Circle } from "../RadioView";

export class RadioField extends Component {
  state = {
    selected: this.props.children.findIndex(({ props }) => props.selected)
  };

  componentDidMount() {
    const { children } = this.props;
    const { selected } = this.state;

    selected > -1 && this.input.onChange(children[selected].props.children);
  }

  render() {
    const { children, horizontal, onChange = e => e, ...props } = this.props;

    return (
      <Field {...props}>
        {({ input, meta: { state, errored, error } }) => {
          this.input = input;

          return (
            <Wrapper horizontal={horizontal}>
              {React.Children.map(children, (item, index) => {
                const { children, disabled, selected } = item.props;

                return (
                  <Option disabled={disabled}>
                    <input
                      type="radio"
                      {...{
                        onChange: () => {
                          !disabled && input.onChange(children);
                          this.setState({
                            selected: index
                          });
                        },
                        value: children,
                        name: input.name,
                        disabled
                      }}
                    />
                    <Circle
                      selected={this.state.selected === index}
                      disabled={disabled}
                    />
                    {children}
                  </Option>
                );
              })}
            </Wrapper>
          );
        }}
      </Field>
    );
  }
}
