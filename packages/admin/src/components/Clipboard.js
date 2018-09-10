import React from "react";
import styled from "react-emotion/macro";

import Tooltip from "./Tooltip";

class Clipboard extends React.Component {
  state = {
    showTooltip: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.showTooltip) {
      this.timeout = setTimeout(() => {
        this.setState(() => ({ showTooltip: false }));
      }, 1500);
    }
    return true;
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  render() {
    const { silent, text, children, render = children } = this.props;
    const Component = () => (
      <Pointer onClick={this.copy}>
        <Textarea
          innerRef={textarea => (this.textarea = textarea)}
          defaultValue={text}
        />
        {render(text)}
      </Pointer>
    );

    if (!silent) {
      return (
        <Tooltip
          content={"Скопійовано"}
          component={Component}
          disableHover
          showTooltip={this.state.showTooltip}
        />
      );
    }

    return <Component />;
  }
  copy = () => {
    const textarea = this.textarea;
    textarea.select();
    try {
      document.execCommand("copy");
      this.setState({ showTooltip: true });
    } catch (err) {
      alert(`Oops, unable to copy (${err.message})`);
    }
  };
}

export default Clipboard;

const Textarea = styled.textarea`
  position: absolute;
  opacity: 0;
`;

const Pointer = styled.div`
  cursor: pointer;
  user-select: none;
  &:active {
    color: #fff;
    background: #017696;
  }
`;
