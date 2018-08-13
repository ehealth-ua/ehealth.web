import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import { fetchPersons } from "../../../redux/persons";

export const showPersons = createAction("personSearchPage/SHOW_PERSONS");
export const pagingPersons = createAction("personSearchPage/ADD_PAGING");

export const fetchPersonsList = ({ ...options }) => dispatch =>
  dispatch(
    fetchPersons({
      ...options,
      ...checkPhone(options.mobile_phone)
    })
  ).then(action => {
    if (action.error && action.payload.status !== 422) {
      throw action;
    }

    return [
      dispatch(showPersons(action.payload.result || [])),
      dispatch(pagingPersons(action.meta || {}))
    ];
  });

const checkPhone = phone => {
  if (!phone) return {};
  return { mobile_phone: `380${phone.replace(/\s/g, "")}` };
};

const persons = handleAction(
  showPersons,
  (state, action) => action.payload,
  []
);

const paging = handleAction(
  pagingPersons,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  persons,
  paging
});
