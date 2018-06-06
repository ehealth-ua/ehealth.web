import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import compose from "recompose/compose";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import debounce from "lodash/debounce";
import { parseSearchParams, stringifySearchParams } from "@ehealth/utils";

class HistoryState extends Component {
  static defaultProps = {
    updateDebounce: 500
  };

  state = parseSearchParams(this.props.location.search);

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.setState(parseSearchParams(nextProps.location.search));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(isEqual(nextProps, this.props) || isEqual(nextState, this.state));
  }

  render() {
    const { children, render = children } = this.props;

    const {
      state: searchParams,
      setSearchParams,
      setSearchParamsImmediate
    } = this;

    return render({
      searchParams,
      setSearchParams,
      setSearchParamsImmediate
    });
  }

  setSearchParams = (params, method) => {
    this.setState(compose(stringifyValues, createUpdater(params)), () =>
      this.updateHistoryFromState(method)
    );
  };

  updateHistoryFromState = debounce(
    method => this.setSearchParamsImmediate(this.state, method),
    this.props.updateDebounce
  );

  setSearchParamsImmediate = (params, method = "push") => {
    const { location, history } = this.props;

    const search = compose(
      stringifySearchParams,
      createUpdater(params, true),
      parseSearchParams
    )(location.search);

    history[method]({ ...location, search });
  };
}

export default withRouter(HistoryState);

const stringifyValues = object =>
  Object.entries(object).reduce(
    (object, [key, value]) => ({
      ...object,
      [key]: isNil(value) ? value : String(value)
    }),
    {}
  );

const createUpdater = (partialState, merge) => {
  const updater =
    typeof partialState === "function" ? partialState : () => partialState;

  return merge ? state => ({ ...state, ...updater(state) }) : updater;
};
