import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import { fetchRegisterEntries } from "../../../redux/register-entries";

export const showRegistersEntries = createAction(
  "registersEntriesPage/SHOW_REGISTERS"
);
export const pagingRegistersEntries = createAction(
  "registersEntriesPage/ADD_PAGING"
);

export const fetchRegisterEntriesList = options => dispatch =>
  dispatch(fetchRegisterEntries(options)).then(action => {
    if (action.error && action.payload.status !== 422) {
      throw action;
    }

    return [
      dispatch(showRegistersEntries(action.payload.result || [])),
      dispatch(pagingRegistersEntries(action.meta || {}))
    ];
  });

const registerEntries = handleAction(
  showRegistersEntries,
  (state, action) => action.payload,
  []
);

const paging = handleAction(
  pagingRegistersEntries,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  registerEntries,
  paging
});
