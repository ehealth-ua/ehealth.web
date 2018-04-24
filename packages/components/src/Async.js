import React, { Component } from "react";

class Async extends Component {
  state = {
    resolved: false
  };

  await = () => Promise.resolve();

  async componentDidMount() {
    await this.props["await"]();
    this.setState({ resolved: true });
  }

  render() {
    return this.state.resolved ? this.props.children : null;
  }
}

export default Async;
