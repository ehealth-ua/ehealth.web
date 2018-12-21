// @flow
import * as React from "react";
import MaskedInput from "react-text-mask";
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";
import format from "date-fns/format";
import Composer from "react-composer";
import { Field, DatePicker } from "@ehealth/components";
import { CalendarIcon } from "@ehealth/icons";
import { formatDate, parseDate } from "@ehealth/utils";

import * as FieldView from "../FieldView";
import * as InputView from "../InputView";

/* @example
*  <>
*     <Field.RangePicker
*       rangeNames={[
*         "filter.personal.startDateFrom",
*         "filter.personal.startDateTo"
*       ]}
*       label="Початок дії контракту"
*     />
*     <Validation
*       field="filter.personal.startDateFrom"
*       validate={validateRequiredObjectField("filter.personal")}
*       message="Обов&#700;язкове поле"
*     />
*     <Validation
*       field="filter.personal.startDateTo"
*       validate={validateRequiredObjectField("filter.personal")}
*       message="Обов&#700;язкове поле"
*     />
*   </>
*   <>
*     <Field.RangePicker
*       rangeNames={[
*         "filter.personal.endDateFrom",
*         "filter.personal.endDateTo"
*       ]}
*       label="Кінець дії контракту"
*     />
*     <Validation
*       field="filter.personal.endDateFrom"
*       validate={validateRequiredObjectField("filter.personal")}
*       message="Обов&#700;язкове поле"
*     />
*     <Validation
*       field="filter.personal.endDateTo"
*       validate={validateRequiredObjectField("filter.personal")}
*       message="Обов&#700;язкове поле"
*     />
*   </>
*/

const autoCorrectedDatePipe = createAutoCorrectedDatePipe("dd.mm.yyyy");

type RangeDateFieldState = {|
  opened: "none" | "start" | "end"
|};

type RangeDateFieldProps = {|
  name: string,
  label?: string,
  hint?: string,
  warning?: string,
  rangeNames: string[]
|};

class RangeDateField extends React.Component<
  RangeDateFieldProps,
  RangeDateFieldState
> {
  state = {
    opened: "none"
  };

  componentWillUnmount() {
    this.internalClearTimeouts();
  }

  calendar = React.createRef();

  render() {
    const {
      rangeNames: [start, end],
      label,
      hint,
      ...props
    } = this.props;
    return (
      <FieldView.Wrapper>
        {label && (
          <FieldView.Header>
            <FieldView.Label>{label}</FieldView.Label>
            {hint && <FieldView.Message>{hint}</FieldView.Message>}
          </FieldView.Header>
        )}
        <Composer
          components={[
            <Field name={start} {...props} />,
            <Field name={end} {...props} />
          ]}
        >
          {([propsFrom, propsTo]) => (
            <>
              <InputView.Border
                state={propsFrom.meta.state || propsTo.meta.state}
                innerRef={this.calendar}
              >
                <InputView.Content
                  pl={2}
                  py={0}
                  flex="none"
                  display="flex"
                  alignItems="center"
                >
                  <CalendarIcon />
                </InputView.Content>
                <Calendar
                  name={start}
                  label="from"
                  onFocus={() =>
                    this.setState({
                      opened: "start"
                    })
                  }
                  onBlur={this.handleBlur}
                  handleDateSelect={this.handleDateSelect}
                  getSelectedDate={value =>
                    this.getSelectedDate(value, propsTo.input.value)
                  }
                  handleKeyPress={this.handleKeyPress}
                  maxDate={this.getMinMaxDate(propsTo.input.value)}
                  opened={this.state.opened === "start"}
                  {...propsFrom}
                />

                <InputView.Content>-</InputView.Content>
                <Calendar
                  name={end}
                  label="to"
                  onFocus={() =>
                    this.setState({
                      opened: "end"
                    })
                  }
                  onBlur={this.handleBlur}
                  handleDateSelect={this.handleDateSelect}
                  getSelectedDate={value =>
                    this.getSelectedDate(value, propsFrom.input.value)
                  }
                  handleKeyPress={this.handleKeyPress}
                  minDate={this.getMinMaxDate(propsFrom.input.value)}
                  opened={this.state.opened === "end"}
                  {...propsTo}
                />
              </InputView.Border>
              <FieldView.Footer>
                <FieldView.Message
                  state={propsFrom.meta.state || propsTo.meta.state}
                >
                  {(propsFrom.meta.errored && propsFrom.meta.error) ||
                    (propsTo.meta.errored && propsTo.meta.error)}
                </FieldView.Message>
              </FieldView.Footer>
            </>
          )}
        </Composer>
      </FieldView.Wrapper>
    );
  }

  getSelectedDate(value: string, rangedDate: string) {
    const parsedDate = Date.parse(value);
    const parsedRangedDate = Date.parse(rangedDate);
    return new Date(
      isNaN(parsedDate)
        ? isNaN(parsedRangedDate)
          ? Date.now()
          : parsedRangedDate
        : parsedDate
    );
  }

  getMinMaxDate(value: string) {
    if (!value) return null;
    return new Date(Date.parse(value));
  }

  handleDateSelect = (onFieldChange: string => mixed) => ({
    selectable,
    date
  }: {
    selectable: boolean,
    date: Date
  }) => {
    if (!selectable) return;

    this.setState({ opened: "none" });
    onFieldChange(format(date, "YYYY-MM-DD"));
  };

  handleBlur = () => {
    this.internalSetTimeout(() => {
      if (
        document.hasFocus() &&
        !this.calendar.current.contains(document.activeElement)
      ) {
        this.setState({ opened: "none" });
      }
    });
  };
  handleKeyPress = (e: SyntheticKeyboardEvent<>) =>
    e.key === "Enter" && this.setState({ opened: "none" });

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
}

export default RangeDateField;

type CalendarProps = {|
  name: string,
  minDate?: Date | null,
  maxDate?: Date | null,
  opened: boolean,
  onFocus: () => mixed,
  onBlur: () => mixed,
  getSelectedDate: string => mixed,
  handleKeyPress: (SyntheticKeyboardEvent<>) => mixed,
  handleDateSelect: string => mixed => mixed
|};

const Calendar = ({
  minDate,
  maxDate,
  opened,
  onFocus,
  onBlur,
  handleKeyPress,
  handleDateSelect,
  getSelectedDate,
  placement = "bottom",
  ...props
}: CalendarProps) => (
  <FieldView.Wrapper maxWidth={100} px={2}>
    <label onFocus={onFocus} onBlur={onBlur}>
      <Field format={formatDate} parse={parseDate} {...props}>
        {({ input }) => (
          <InputView.Content
            {...input}
            is={MaskedInput}
            onKeyPress={handleKeyPress}
            placeholder="ДД.ММ.РРРР"
            mask={[/\d/, /\d/, ".", /\d/, /\d/, ".", /\d/, /\d/, /\d/, /\d/]}
            guide={false}
            pipe={autoCorrectedDatePipe}
            width="100%"
            autocomplete="off"
          />
        )}
      </Field>
    </label>
    {opened && (
      <Field {...props}>
        {({ input: { value, onChange } }) => (
          <DatePicker
            placement={placement}
            selected={getSelectedDate(value)}
            onDateSelected={handleDateSelect(onChange)}
            minDate={minDate}
            maxDate={maxDate}
          />
        )}
      </Field>
    )}
  </FieldView.Wrapper>
);
