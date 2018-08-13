import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromEmployee from "../../../redux/employees";

export const showEmployee = createAction("employeeDetailPage/SHOW_EMPLOYEE");

export const fetchEmployee = id => dispatch =>
  dispatch(fromEmployee.fetchEmployee(id)).then(action => {
    if (action.error) throw action;
    return dispatch(
      showEmployee(action.payload.entities.employees[action.payload.result])
    );
  });

const employee = handleAction(
  showEmployee,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  employee
});
