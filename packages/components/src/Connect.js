// Original implementation by Gott Phusit
// https://medium.com/netscape/connecting-react-component-to-redux-store-with-render-callback-53fd044bb42b
// https://gist.github.com/go1t/2c40beee8ad751342d6978f1f11b9b7a#file-connect-jsx

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const Connect = ({ children, render = children, ...props }) => render(props);

const noop = () => ({});

export default connect(
  (state, { mapStateToProps = noop }) => mapStateToProps(state),
  (dispatch, { mapDispatchToProps = noop }) =>
    typeof mapDispatchToProps === "object"
      ? bindActionCreators(mapDispatchToProps, dispatch)
      : mapDispatchToProps(dispatch)
)(Connect);
