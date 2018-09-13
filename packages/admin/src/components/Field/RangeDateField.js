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

type RangeDateFieldState = {|
  opened: "none" | "start" | "end",
  from: ?Date,
  to: ?Date
|};

type RangeDateFieldProps = {|
  name: string,
  label?: string,
  hint?: string
|};

class RangeDateField extends React.Component<
  RangeDateFieldProps,
  RangeDateFieldState
> {
  state = {
    opened: "none",
    from: null,
    to: null
  };

  componentWillUnmount() {
    this.internalClearTimeouts();
  }

  render() {
    const { name, label, hint, ...props } = this.props;
    return (
      <FieldView.Wrapper>
        {label && (
          <FieldView.Header>
            <FieldView.Label>{label}</FieldView.Label>
            {hint && <FieldView.Message>{hint}</FieldView.Message>}
          </FieldView.Header>
        )}
        <InputView.Border>
          <InputView.Content px={2} flex="none">
            <CalendarIcon />
          </InputView.Content>
          <InputView.Content>
            <Calendar
              name="from"
              {...props}
              onFocus={() => this.setState({ opened: "start" })}
              onBlur={this.handleBlur}
              handleOnDateSelected={this.handleOnDateSelected}
              handleKeyPress={this.handleKeyPress}
              maxDate={this.state.to}
              opened={this.state.opened === "start"}
            />
          </InputView.Content>
          <InputView.Content>{" - "}</InputView.Content>
          <InputView.Content>
            <Calendar
              name="to"
              {...props}
              onFocus={() => this.setState({ opened: "end" })}
              onBlur={this.handleBlur}
              handleOnDateSelected={this.handleOnDateSelected}
              handleKeyPress={this.handleKeyPress}
              minDate={this.state.from}
              opened={this.state.opened === "end"}
            />
          </InputView.Content>
        </InputView.Border>
      </FieldView.Wrapper>
    );
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

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

  handleOnDateSelected = (selected, selectable, date, input, name) => {
    if (!selectable) return;

    this.onChange(name, date);
    input.onChange(date.toLocaleDateString("en-GB"));
    this.setState({ opened: "none" });
  };

  handleBlur = () => {
    this.internalSetTimeout(() => {
      if (
        document.hasFocus() &&
        document.activeElement === document.body &&
        document.activeElement !== document.documentElement
      ) {
        this.setState({ opened: "none" });
      }
    });
  };

  handleKeyPress = e => {
    e.key === "Enter" && this.setState({ opened: "none" });
  };
}

export default RangeDateField;

const Container = styled.div`
  position: relative;
`;

type CalendarProps = {|
  name: string,
  minDate: Date,
  maxDate: Date,
  opened: boolean,
  onFocus: () => mixed,
  onBlur: () => mixed,
  handleKeyPress: () => mixed,
  handleOnDateSelected: () => mixed
|};

const Calendar = ({
  name,
  minDate,
  maxDate,
  opened,
  onFocus,
  onBlur,
  handleKeyPress,
  handleOnDateSelected,
  ...props
}: CalendarProps) => (
  <Field {...props} name={name}>
    {({ input: { name, ...input } }) => {
      const selectedDate =
        input.value.length === 10 && new Date(parseDate(input.value));
      return (
        <Container onFocus={onFocus} onBlur={onBlur}>
          <FieldView.Wrapper is="label" maxWidth={80}>
            <MaskedInput
              {...input}
              name={`date_${name}_start_date`}
              onKeyPress={handleKeyPress}
              mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
              guide={false}
              pipe={autoCorrectedDatePipe}
              placeholder="ДД/ММ/РР"
            />
          </FieldView.Wrapper>
          {opened && (
            <DatePicker
              selected={selectedDate || new Date()}
              onDateSelected={({ selected, selectable, date }) =>
                handleOnDateSelected(selected, selectable, date, input, name)
              }
              minDate={minDate}
              maxDate={maxDate}
            />
          )}
        </Container>
      );
    }}
  </Field>
);
