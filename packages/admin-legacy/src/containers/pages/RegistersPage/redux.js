import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import { fetchRegisters } from "../../../redux/registers";

export const showRegisters = createAction("registersPage/SHOW_REGISTERS");
export const pagingRegisters = createAction("registersPage/ADD_PAGING");

export const fetchRegistersList = options => dispatch =>
  dispatch(fetchRegisters(options)).then(action => {
    if (action.error && action.payload.status !== 422) {
      throw action;
    }

    return [
      dispatch(showRegisters(action.payload.result || [])),
      dispatch(pagingRegisters(action.meta || {}))
    ];
  });

const registers = handleAction(
  showRegisters,
  (state, action) => action.payload,
  []
);

const paging = handleAction(
  pagingRegisters,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  registers,
  paging
});
