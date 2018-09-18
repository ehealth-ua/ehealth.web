import React, { Component } from "react";
import { Field } from "@ehealth/components";
import { Wrapper, Option, Circle } from "../RadioView";

/**
 * @example
 *
 * ```jsx
 * <Form {...props}>
 *   <RadioField name="radioselect">
 *     <Option>Value 1</Option>
 *     <Option selected>Value 2</Option>
 *     <Option>Value 3</Option>
 *   </RadioField>
 *   <Form.Submit block>Далі</Form.Submit>
 * </Form>
 * ```
 *
 * Optional prop for RadioField: horizontal for changing view
 * Optional props for Option: selected, disabled (can use both)
 */

export default class RadioField extends Component {
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
