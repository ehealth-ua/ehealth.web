import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromContracts from "../../../redux/contracts";

export const showContract = createAction(
  "contractRequestsDetailsPage/SHOW_CONTRACT"
);

export const getContract = createAction(
  "getContractRequestPrintoutContent/GET_CONTRACT"
);

export const fetchContractRequest = id => dispatch =>
  dispatch(fromContracts.fetchContractRequest(id)).then(action => {
    if (action.error) throw action;
    return dispatch(showContract(action.payload.result));
  });

export const getContractRequestPrintoutContent = id => dispatch =>
  dispatch(fromContracts.getContractRequestPrintoutContent(id)).then(action => {
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
