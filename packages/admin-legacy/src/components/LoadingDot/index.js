import React from "react";

class LoadingDot extends React.Component {
  state = {
    dots: ""
  };
  componentDidMount() {
    this.interval = setInterval(() => {
      const { dots } = this.state;
      this.setState({
        dots: dots.length >= 3 ? "" : `${dots}.`
      });
    }, 200);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const { align = "center" } = this.props;
    const { dots } = this.state;
    return <span style={{ textAlign: align }}>{dots}</span>;
  }
}
export default LoadingDot;
