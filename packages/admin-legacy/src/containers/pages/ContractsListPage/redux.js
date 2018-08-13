import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromContracts from "../../../redux/contracts";

export const showContracts = createAction("contractsListPage/SHOW_CONTRACTS");
export const pagingContracts = createAction("contractsListPage/ADD_PAGING");

export const fetchContracts = options => dispatch =>
  dispatch(fromContracts.fetchContracts(options)).then(action => {
    if (action.error && action.payload.status !== 422) {
      throw action;
    }

    return [
      dispatch(showContracts(action.payload.result || [])),
      dispatch(pagingContracts(action.meta || {}))
    ];
  });

const contracts = handleAction(
  showContracts,
  (state, action) => action.payload,
  []
);
const paging = handleAction(
  pagingContracts,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  contracts,
  paging
});
