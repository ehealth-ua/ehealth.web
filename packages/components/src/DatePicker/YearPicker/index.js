import React, { Component } from "react";

import { Button, Title, Header } from "../Header";
import YearsList from "./YearsList";

class YearPicker extends Component {
  state = {
    selectedYear: this.props.selectedYear
      ? parseInt(this.props.selectedYear, 10)
      : new Date().getFullYear()
  };

  render() {
    const { selectedYear } = this.state;
    const { chooseYear } = this.props;
    return (
      <>
        <Header data-test="yearsHeader">
          <Button
            onMouseDown={e => e.preventDefault()}
            onClick={e => {
              e.preventDefault();
              this.decreaseYear();
            }}
            direction="backward"
          />
          <Title
            onMouseDown={e => e.preventDefault()}
            onClick={() => chooseYear(selectedYear)}
          >
            {selectedYear}
          </Title>
          <Button
            onMouseDown={e => e.preventDefault()}
            onMouseUp={e => e.preventDefault()}
            onClick={e => {
              e.preventDefault();
              this.increaseYear();
            }}
            direction="forward"
          />
        </Header>
        <YearsList chooseYear={chooseYear} selectedYear={selectedYear} />
      </>
    );
  }

  increaseYear = () => {
    this.setState({ selectedYear: this.state.selectedYear + 1 });
  };

  decreaseYear = () => {
    this.setState({ selectedYear: this.state.selectedYear - 1 });
  };
}

export default YearPicker;
