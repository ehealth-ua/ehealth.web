import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromEmployees from "../../../redux/employees-requests";

export const showPendingEmployees = createAction(
  "pendingEmployeesListPage/SHOW_DECLARATIONS"
);
export const pagingEmployees = createAction(
  "pendingEmployeesListPage/ADD_PAGING"
);

export const fetchEmployeesRequest = options => dispatch =>
  dispatch(fromEmployees.fetchEmployeesRequest(options)).then(action => {
    if (action.error && action.payload.status !== 422) {
      throw action;
    }
    dispatch(showPendingEmployees(action.payload.result || []));
    dispatch(pagingEmployees(action.meta || {}));

    return action;
  });

const employeesRequests = handleAction(
  showPendingEmployees,
  (state, action) => action.payload,
  []
);
const paging = handleAction(
  pagingEmployees,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  employeesRequests,
  paging
});
