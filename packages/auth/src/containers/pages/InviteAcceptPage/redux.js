import {
  performActionWithRequest,
  APPROVE_REQUEST_ACTION,
  REJECT_REQUEST_ACTION
} from "../../../redux/requests";
import { getLocation } from "../../../reducers";
import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
import error_messages from "../../../helpers/errors";

export const onSubmit = id => (dispatch, getState) =>
  dispatch(performActionWithRequest(id, APPROVE_REQUEST_ACTION)).then(
    action => {
      const state = getState();
      const location = getLocation(state);
      if (action.error) {
        location.state = {
          action: action.payload.response.error
        };
      }

      return dispatch([
        push({
          ...location,
          pathname: "/invite/success"
        })
      ]);
    }
  );

export const onReject = id => (dispatch, getState) =>
  dispatch(performActionWithRequest(id, REJECT_REQUEST_ACTION)).then(action => {
    if (action.error) return action;

    const state = getState();
    const location = getLocation(state);

    return dispatch([
      push({
        ...location,
        pathname: "/invite/reject"
      })
    ]);
  });
