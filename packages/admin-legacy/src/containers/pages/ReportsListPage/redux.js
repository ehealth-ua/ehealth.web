import { combineReducers } from "redux";
import { handleAction, createAction } from "redux-actions";
import * as fromReports from "../../../redux/capitation-reports";
import * as fromReportsList from "../../../redux/capitation-reports-list";

export const showReports = createAction("reportsListPage/SHOW_REPORTS");
export const getListOfReports = createAction(
  "reportsListPage/GET_LIST_OF_REPORTS"
);
export const pagingReports = createAction("reportsListPage/ADD_PAGING");

export const fetchCapitationReports = options => dispatch =>
  dispatch(fromReports.fetchCapitationReports(options)).then(action => {
    if (action.error && action.payload.status !== 422) {
      throw action;
    }
    return [
      dispatch(showReports(action.payload.result || [])),
      dispatch(pagingReports(action.meta || {}))
    ];
  });

export const fetchCapitationReportsList = options => dispatch =>
  dispatch(fromReportsList.fetchCapitationReportsList(options)).then(action => {
    if (action.error && action.payload.status !== 422) {
      throw action;
    }
    return [
      dispatch(getListOfReports(action.payload.result || [])),
      dispatch(pagingReports(action.meta || {}))
    ];
  });

const capitation_reports = handleAction(
  showReports,
  (state, action) => action.payload,
  []
);

const capitation_reports_list = handleAction(
  getListOfReports,
  (state, action) => action.payload,
  []
);

const paging = handleAction(
  pagingReports,
  (state, action) => action.payload,
  {}
);

export default combineReducers({
  capitation_reports,
  capitation_reports_list,
  paging
});
