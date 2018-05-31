import React, { Component } from "react";
import { FormSpy } from "react-final-form";
import debounce from "lodash/debounce";
import isObject from "lodash/isObject";
import { HistoryState } from "@ehealth/components";
import { shallowEqual } from "shouldcomponentupdate-children";

export default class FormAutoFetch extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props, nextState, this.setState);
  }

  renderFnDebounced = debounce(this.renderFn, this.props.debounce, {
    leading: true
  });

  renderFn(stateAndHelpers) {
    const { children, render = children } = this.props;
    return render(stateAndHelpers);
  }

  render() {
    return (
      <HistoryState>
        {({ searchParams, setSearchParams }) => (
          <FormSpy subscription={{ values: true }}>
            {({ values }) => {
              if (Object.keys(values).length) {
                Object.entries(values).map(([k, v]) => {
                  if (isObject(v)) {
                    setSearchParams(v);
                  } else {
                    setSearchParams({ [k]: v });
                  }
                });
              }
              return this.renderFnDebounced({ values, searchParams });
            }}
          </FormSpy>
        )}
      </HistoryState>
    );
  }
}
