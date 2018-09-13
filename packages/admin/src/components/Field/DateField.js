// @flow
import React from "react";
import MaskedInput from "react-text-mask";
import styled from "react-emotion/macro";
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";

import { Field, DatePicker } from "@ehealth/components";
import { CalendarIcon } from "@ehealth/icons";
import { parseDate } from "@ehealth/utils";

import * as FieldView from "../FieldView";
import * as InputView from "../InputView";

const autoCorrectedDatePipe = createAutoCorrectedDatePipe("dd/mm/yyyy");

type DateFieldState = {|
  isOpen: boolean
|};

type DateFieldProps = {|
  name: string,
  label?: string,
  hint?: string,
  warning?: string
|};

class DateField extends React.Component<DateFieldProps, DateFieldState> {
  state = {
    isOpen: false
  };

  componentWillUnmount() {
    this.internalClearTimeouts();
  }

  render() {
    const { label, hint, warning, ...props } = this.props;

    return (
      <Field {...props}>
        {({ input, meta: { state, errored, error } }) => {
          const selectedDate =
            input.value.length === 10 && new Date(parseDate(input.value));
          return (
            <Container onFocus={this.handleFocus} onBlur={this.handleBlur}>
              <FieldView.Wrapper is="label">
                {label && (
                  <FieldView.Header>
                    <FieldView.Label>{label}</FieldView.Label>
                    {hint && <FieldView.Message>{hint}</FieldView.Message>}
                  </FieldView.Header>
                )}

                <InputView.Border state={state}>
                  <InputView.Content px={2} flex="none">
                    <CalendarIcon />
                  </InputView.Content>
                  <InputView.Content>
                    <MaskedInput
                      {...input}
                      onKeyPress={this.handleKeyPress}
                      mask={[
                        /\d/,
                        /\d/,
                        "/",
                        /\d/,
                        /\d/,
                        "/",
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/
                      ]}
                      guide={false}
                      pipe={autoCorrectedDatePipe}
                      placeholder="ДД/ММ/РР"
                    />
                  </InputView.Content>
                </InputView.Border>

                <FieldView.Footer>
                  <FieldView.Message state={state}>
                    {errored ? error : warning}
                  </FieldView.Message>
                </FieldView.Footer>
              </FieldView.Wrapper>
              {this.state.isOpen && (
                <DatePicker
                  selected={selectedDate || new Date()}
                  onDateSelected={({ selected, selectable, date }) =>
                    this.handleOnDateSelected(selected, selectable, date, input)
                  }
                />
              )}
            </Container>
          );
        }}
      </Field>
    );
  }

  timeoutIds = [];

  internalSetTimeout = (fn, time) => {
    const id = setTimeout(() => {
      this.timeoutIds = this.timeoutIds.filter(i => i !== id);
      fn();
    }, time);

    this.timeoutIds.push(id);
  };

  internalClearTimeouts() {
    this.timeoutIds.forEach(id => {
      clearTimeout(id);
    });

    this.timeoutIds = [];
  }

  handleOnDateSelected = (selected, selectable, date, input) => {
    if (!selectable) {
      return;
    }

    this.setState({ isOpen: false });
    input.onChange(date.toLocaleDateString("en-GB"));
  };

  handleFocus = () => {
    this.setState({
      isOpen: true
    });
  };

  handleBlur = () => {
    this.internalSetTimeout(() => {
      if (
        document.hasFocus() &&
        document.activeElement === document.body &&
        document.activeElement !== document.documentElement
      ) {
        this.setState({ isOpen: false });
      }
    });
  };

  handleKeyPress = e => e.key === "Enter" && this.setState({ isOpen: false });
}

export default DateField;

const Container = styled.div`
  position: relative;
`;
