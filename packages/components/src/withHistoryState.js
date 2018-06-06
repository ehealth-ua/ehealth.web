import React from "react";
import HistoryState from "./HistoryState";

const withHistoryStateHOC = WrappedComponent => {
  const withHistoryState = props => (
    <HistoryState>
      {injectedProps => <WrappedComponent {...injectedProps} {...props} />}
    </HistoryState>
  );
  return withHistoryState;
};

export default withHistoryStateHOC;
