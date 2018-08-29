import React from "react";
import DatePicker from "../DatePicker";

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
    const { state } = this;
    const { selectedDate } = state;
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
