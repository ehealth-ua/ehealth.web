// @flow
import * as React from "react";
import MaskedInput from "react-text-mask";
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";
import format from "date-fns/format";
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
  warning?: string,
  minDate?: string,
  placement?: string
|};

class DateField extends React.Component<DateFieldProps, DateFieldState> {
  state = {
    isOpen: false
  };

  componentWillUnmount() {
    this.internalClearTimeouts();
  }

  calendar = React.createRef();

  render() {
    const {
      label,
      hint,
      warning,
      placement = "bottom",
      minDate,
      maxDate,
      ...props
    } = this.props;
    const { isOpen } = this.state;

    return (
      <FieldView.Wrapper innerRef={this.calendar}>
        <label
          onClick={this.handleClick}
          onBlur={this.handleBlur}
          ref={label => (this.label = label)}
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
        </label>

        {isOpen && (
          <Field {...props}>
            {({ input: { value, onChange } }) => (
              <DatePicker
                placement={placement}
                minDate={this.getSelectedDate(minDate)}
                maxDate={maxDate ? new Date(maxDate) : undefined}
                selected={this.getSelectedDate(value)}
                onDateSelected={this.handleDateSelect(onChange)}
              />
            )}
          </Field>
        )}
      </FieldView.Wrapper>
    );
  }

  label: ?HTMLLabelElement;

  timeoutIds: TimeoutID[] = [];

  internalSetTimeout = (fn: () => mixed, time?: number): void => {
    const id: TimeoutID = setTimeout(() => {
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

  getSelectedDate(value: string) {
    const parsedDate = Date.parse(value);
    return new Date(isNaN(parsedDate) ? Date.now() : parsedDate);
  }

  handleDateSelect = (onFieldChange: string => mixed) => ({
    selectable,
    date
  }: {
    selectable: boolean,
    date: Date
  }) => {
    if (!selectable) return;

    this.setState({ isOpen: false });
    if (this.label) {
      this.label.focus();
    }
    onFieldChange(format(date, "YYYY-MM-DD"));
  };

  handleClick = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  handleBlur = () => {
    this.internalSetTimeout(() => {
      if (
        document.hasFocus() &&
        !this.calendar.current.contains(document.activeElement)
      ) {
        this.setState({ isOpen: false });
      }
    });
  };

  handleKeyPress = (e: SyntheticKeyboardEvent<>) =>
    e.key === "Enter" && this.setState({ isOpen: false });
}

export default DateField;
