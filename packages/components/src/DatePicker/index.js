import React, { Component } from "react";

import YearPicker from "./YearPicker";
import DayPicker from "./DayPicker";
import MonthPicker from "./MonthPicker";
import { Container } from "./Body";

import { Switch } from "@ehealth/components";

type Props = {|
  date?: Date,
  selected?: Date | Date[],
  monthsToDisplay?: number,
  firstDayOfWeek?: number,
  offset?: number,
  minDate?: Date,
  maxDate?: Date,
  fillAdjacentMonths?: boolean,
  showOutsideDays?: boolean,
  onDateSelected: () => mixed,
  onOffsetChanged: () => mixed
|};

type State = {|
  mode: string,
  offset: number,
  selectedYear: ?number,
  currentYear: number,
  currentMonth: number
|};

class Datepicker extends Component<Props, State> {
  state = {
    mode: "day",
    offset: 0,
    selectedYear: null,
    currentYear: parseInt(new Date().getFullYear(), 10),
    currentMonth: parseInt(new Date().getMonth(), 10)
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.selected.getFullYear() !== this.props.selected.getFullYear()
    ) {
      this.choiseYear(nextProps.selected.getFullYear());
    }

    if (nextProps.selected.getMonth() !== this.props.selected.getMonth()) {
      this.choiseMonth(nextProps.selected.getMonth());
    }

    return true;
  }
  componentWillMount() {
    this.choiseYear(this.props.selected.getFullYear());
    this.choiseMonth(this.props.selected.getMonth());
  }
  render() {
    return (
      <Container>
        <Switch
          value={this.state.mode}
          year={
            <YearPicker
              selectedYear={this.state.selectedYear}
              choiseYear={this.choiseYear}
              switchMode={this.switchMode}
            />
          }
          month={
            <MonthPicker
              currentMonth={this.state.currentMonth}
              choiseMonth={this.choiseMonth}
              switchMode={this.switchMode}
            />
          }
          day={
            <DayPicker
              offset={this.state.offset}
              increase={this.increase}
              decrease={this.decrease}
              switchMode={this.switchMode}
              getCurrentMonth={this.getCurrentMonth}
              {...this.props}
            />
          }
        />
      </Container>
    );
  }

  choiseYear = (year: number): void => {
    this.setState(({ currentYear }) => ({
      selectedYear: year,
      mode: "day",
      offset: -(currentYear - year) * 12
    }));
  };

  choiseMonth = (month: number): void => {
    this.setState(({ offset, currentMonth }) => ({
      currentMonth: month,
      mode: "day",
      offset: offset + (month - currentMonth)
    }));
  };

  getCurrentMonth = (month: number): void => {
    this.setState({ currentMonth: month });
  };

  increase = (): void => {
    this.setState(({ offset }) => ({
      offset: offset + 1
    }));
  };

  decrease = (): void => {
    this.setState(({ offset }) => ({
      offset: offset - 1
    }));
  };

  switchMode = (mode: string): void => {
    this.setState({ mode });
  };
}

export default Datepicker;
