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
    const { choiseYear } = this.props;
    return (
      <>
        <Header data-test="yearsHeader">
          <Button onClick={this.decreaseYear} direction="forward" />
          <Title onClick={() => choiseYear(selectedYear)}>{selectedYear}</Title>
          <Button onClick={this.increaseYear} direction="backward" />
        </Header>
        <YearsList choiseYear={choiseYear} selectedYear={selectedYear} />
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
