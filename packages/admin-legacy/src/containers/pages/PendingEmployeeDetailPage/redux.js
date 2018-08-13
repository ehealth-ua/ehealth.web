import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromEmployee from "../../../redux/employees-requests";

export const showPendingEmployee = createAction(
  "pendingEmployeeDetailPage/SHOW_EMPLOYEE"
);

export const fetchEmployee = id => dispatch =>
  dispatch(fromEmployee.fetchEmployeeRequest(id)).then(action => {
    if (action.error) throw action;
    return dispatch(
      showPendingEmployee(
        action.payload.entities.employeesRequests[action.payload.result]
      )
    );
  });

const employee = handleAction(
  showPendingEmployee,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  employee
});
