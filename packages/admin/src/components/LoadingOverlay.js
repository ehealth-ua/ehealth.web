import React, { Component } from "react";
import { Flex, Box, Text } from "rebass/emotion";
import { LoaderIcon } from "@ehealth/icons";
import { ifProp } from "styled-tools";
import system from "system-components/emotion";

class LoadingOverlay extends Component {
  state = {
    delayLoading: false,
    loadingFromState: false,
    delayBeforeLoading: 1000,
    delayAfterLoading: 500
  };

  componentDidMount() {
    const { loading } = this.props;
    if (loading) {
      this.setState({ loadingFromState: true });
    }
  }

  shouldComponentUpdate({ loading }) {
    const { loadingFromState, delayAfterLoading } = this.state;
    if (
      loading !== loadingFromState ||
      this.props.loading !== loadingFromState
    ) {
      if (!loading) {
        this.timer = setTimeout(
          () => this.setState({ loadingFromState: false }),
          delayAfterLoading
        );
      } else {
        clearTimeout(this.timer);
        this.setState({ loadingFromState: loading });
      }
    }

    return true;
  }

  render() {
    const {
      table,
      loading,
      fallback: Loader = Spinner,
      children,
      ...props
    } = this.props;

    const { delayLoading, loadingFromState, delayBeforeLoading } = this.state;

    return (
      <Wrapper>
        {loadingFromState && (
          <DelayedSpinner
            delay={delayBeforeLoading}
            delayFn={status => {
              this.setState({ delayLoading: status });
            }}
          >
            <Loader {...props} />
          </DelayedSpinner>
        )}

        <Blur filter={delayLoading}>{children}</Blur>
      </Wrapper>
    );
  }
}

class DelayedSpinner extends Component {
  state = {
    showSpinner: false
  };

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({ showSpinner: true });
      this.props.delayFn(true);
    }, this.props.delay);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.props.delayFn(false);
  }

  render() {
    return this.state.showSpinner && this.props.children;
  }
}

export const Spinner = props => (
  <WrapperLoader
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
    {...props}
  >
    <Text mb="2" fontWeight="600" fontSize="14">
      Завантаження результатів
    </Text>

    <LoaderIcon width="50" height="10" />
  </WrapperLoader>
);

const WrapperLoader = system(
  {
    is: Flex,
    width: "100%",
    height: "100%"
  },
  {
    position: "absolute",

    zIndex: 1
  }
);

const Blur = system({ is: Box, minHeight: 50 }, props => ({
  filter: ifProp("filter", "blur(2px)", "none")(props)
}));

const Wrapper = system(
  {
    is: Box
  },
  {
    position: "relative"
  }
);

export default LoadingOverlay;
