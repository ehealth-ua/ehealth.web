import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromContracts from "../../../redux/contracts";

export const showContract = createAction("contractDetailsPage/SHOW_CONTRACT");

export const getContract = createAction(
  "getContractRequestPrintoutContent/GET_CONTRACT"
);
export const fetchContract = id => dispatch =>
  dispatch(fromContracts.fetchContract(id)).then(action => {
    if (action.error) throw action;
    return dispatch(showContract(action.payload.result));
  });

export const getContractPrintoutContent = id => dispatch =>
  dispatch(fromContracts.getContractPrintoutContent(id)).then(action => {
    if (action.error) throw action;
    return dispatch(getContract(action.payload.result));
  });

const contract = handleAction(
  showContract,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  contract
});
