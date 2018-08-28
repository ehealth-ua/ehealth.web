import React from "react";
import YearPicker from "./YearPicker";
import DayPicker from "./DayPicker";
import MonthPicker from "./MonthPicker";
import { Container } from "./Body";
import { Switch } from "@ehealth/components";

class Datepicker extends React.Component {
  state = {
    mode: "day",
    offset: 0,
    selectedYear: null,
    currentYear: new Date().getFullYear(),
    currentMonth: 0
  };

  componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      this.setState({ offset: 0 });
    }
  }

  render() {
    return (
      <Container>
        <Switch
          value={this.state.mode}
          year={
            <>
              <YearPicker
                selectedYear={this.state.selectedYear}
                choiseYear={this.choiseYear}
                switchMode={this.switchMode}
              />
            </>
          }
          month={
            <>
              <MonthPicker
                currentMonth={this.state.currentMonth}
                choiseMonth={this.choiseMonth}
                switchMode={this.switchMode}
              />
            </>
          }
          day={
            <>
              <DayPicker
                offset={this.state.offset}
                increase={this.increase}
                decrease={this.decrease}
                switchMode={this.switchMode}
                getCurrentMonth={this.getCurrentMonth}
                {...this.props}
              />
            </>
          }
        />
      </Container>
    );
  }

  choiseYear = year => {
    this.setState(({ currentYear }) => ({
      selectedYear: year,
      mode: "day",
      offset: -(currentYear - year) * 12
    }));
  };

  choiseMonth = month => {
    this.setState(({ offset }) => ({
      currentMonth: month,
      mode: "day",
      offset: offset + month - this.state.currentMonth
    }));
  };

  getCurrentMonth = month => {
    this.setState({ currentMonth: month });
  };

  increase = () => {
    this.setState({ offset: this.state.offset + 1 });
  };

  decrease = () => {
    this.setState({ offset: this.state.offset - 1 });
  };

  switchMode = mode => {
    this.setState({ mode });
  };
}

export default Datepicker;
