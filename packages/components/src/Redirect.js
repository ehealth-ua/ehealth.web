import { Component } from "react";
import { withRouter } from "react-router-dom";

class Redirect extends Component {
  componentDidMount() {
    const { router, back, forward, to } = this.props;

    if (!(back || forward || to))
      throw new Error(
        'Invariant Violation: Could not find any of "back", "forward" or "to" props in Redirect component.'
      );

    if (back) {
      router.goBack();
    } else if (forward) {
      router.goForward();
    } else {
      router.push(to);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(Redirect);
