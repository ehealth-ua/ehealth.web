import { Component } from "react";

export default class ForceRedirect extends Component {
  componentDidMount() {
    const { push, to } = this.props;

    if (push) {
      window.location.assign(to);
    } else {
      window.location.replace(to);
    }
  }

  render() {
    return null;
  }
}
