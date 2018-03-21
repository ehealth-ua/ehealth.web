import React from "react";
import { connect } from "react-redux";
import getFn from "lodash/get";

import { getDictionary } from "../../reducers";

const DictionaryValue = ({ value, dictionaryObj }) => (
  <span>{getFn(dictionaryObj, `values[${value}]`, value)}</span>
);

export default connect((state, { dictionary }) => ({
  dictionaryObj: getDictionary(state, dictionary)
}))(DictionaryValue);
