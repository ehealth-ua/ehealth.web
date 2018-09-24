// @flow
import React from "react";
import MaskedInput from "react-text-mask";
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";

import { Field, DatePicker } from "@ehealth/components";
import { CalendarIcon } from "@ehealth/icons";
import { formatDate, parseDate } from "@ehealth/utils";

import * as FieldView from "../FieldView";
import * as InputView from "../InputView";

const autoCorrectedDatePipe = createAutoCorrectedDatePipe("dd.mm.yyyy");

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
    const { isOpen } = this.state;

    return (
      <FieldView.Wrapper
        is="label"
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        {label && (
          <FieldView.Header>
            <FieldView.Label>{label}</FieldView.Label>
            {hint && <FieldView.Message>{hint}</FieldView.Message>}
          </FieldView.Header>
        )}

        <Field format={formatDate} parse={parseDate} {...props}>
          {({ input, meta: { state, errored, error } }) => (
            <>
              <InputView.Border state={state}>
                <InputView.Content
                  pl={2}
                  py={0}
                  flex="none"
                  display="flex"
                  alignItems="center"
                >
                  <CalendarIcon />
                </InputView.Content>
                <InputView.Content
                  is={MaskedInput}
                  width={0}
                  pl={2}
                  pr={3}
                  placeholder="ДД.ММ.РРРР"
                  mask={[
                    /\d/,
                    /\d/,
                    ".",
                    /\d/,
                    /\d/,
                    ".",
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/
                  ]}
                  guide={false}
                  {...input}
                  onKeyPress={this.handleKeyPress}
                  pipe={autoCorrectedDatePipe}
                />
              </InputView.Border>

              <FieldView.Footer>
                <FieldView.Message state={state}>
                  {errored ? error : warning}
                </FieldView.Message>
              </FieldView.Footer>
            </>
          )}
        </Field>

        {isOpen && (
          <Field {...props}>
            {({ input: { value, onChange } }) => (
              <DatePicker
                selected={this.getSelectedDate(value)}
                onDateSelected={this.handleDateSelect(onChange)}
              />
            )}
          </Field>
        )}
      </FieldView.Wrapper>
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

  getSelectedDate(value) {
    const parsedDate = Date.parse(value);
    return new Date(isNaN(parsedDate) ? Date.now() : parsedDate);
  }

  handleDateSelect = onFieldChange => ({ selectable, date }) => {
    if (!selectable) return;

    this.setState({ isOpen: false });
    onFieldChange(date.toISOString().substr(0, 10));
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
