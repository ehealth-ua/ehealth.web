import "react";
import { connect } from "react-redux";
import { hasScope, getScope } from "../../../helpers/scope";

const ShowWithScope = ({ scope, currentScope, children }) =>
  hasScope(scope, currentScope) ? children : null;

export default connect(state => ({
  currentScope: getScope()
}))(ShowWithScope);
