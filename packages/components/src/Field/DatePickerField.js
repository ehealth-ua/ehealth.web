import React from "react";
import Field from "./Field";
import DatePicker from "../DatePicker";
import { TextField, ErrorMessage } from "./InputField";
import FieldView from "./FieldView";

class DatePickerField extends React.Component {
  state = {
    selectedDate: null
  };

  handleOnDateSelected = ({ selected, selectable, date }) => {
    if (!selectable) {
      return;
    }
    this.setState(state => {
      let newDate = date;
      if (
        state.selectedDate &&
        state.selectedDate.getTime() === date.getTime()
      ) {
        newDate = null;
      }
      return { selectedDate: newDate };
    });
  };

  render() {
    const { props, state } = this;
    const { selectedDate, date, firstDayOfWeek, showOutsideDays } = state;
    const { label, horizontal } = props;
    return (
      <>
        <DatePicker
          selected={selectedDate}
          onDateSelected={this.handleOnDateSelected}
        />
        {this.state.selectedDate && (
          <div style={{ paddingTop: 20, textAlign: "center" }}>
            <p>Selected:</p>
            <p data-test="dateSelected">{`${selectedDate.toLocaleDateString()}`}</p>
          </div>
        )}
      </>
    );
  }
}

export default DatePickerField;
