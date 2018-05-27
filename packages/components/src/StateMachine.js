import { Component } from "react";

export default class StateMachine extends Component {
  static defaultProps = {
    initialState: "init",
    onChange: () => {}
  };

  state = {
    currentState: this.props.initialState
  };

  render() {
    const { currentState } = this.state;
    const { transition } = this;
    const { children, render = children } = this.props;

    return render({ state: currentState, transition });
  }

  transition = state => {
    let prevState;

    this.setState(
      ({ currentState }) => {
        prevState = currentState;
        return { currentState: state };
      },
      async () => {
        const { transitions } = this.props;

        if (Object.keys(transitions).includes(state)) {
          const nextState = await transitions[state](prevState);
          if (nextState) this.transition(nextState);
        }
      }
    );
  };
}
