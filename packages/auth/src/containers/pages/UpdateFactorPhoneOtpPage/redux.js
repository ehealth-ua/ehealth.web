import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
import { getLocation } from "../../../reducers";
import { approveFactor } from "../../../redux/factors";
import { login } from "../../../redux/session";

export const onSubmit = ({ code }) => (dispatch, getState) =>
  dispatch(approveFactor(parseInt(code, 10))).then(action => {
    if (action.error) {
      const { type } = action.payload.response.error;
      if (type) {
        throw new SubmissionError({
          code: {
            [type]: true
          }
        });
      }
      return action;
    }

    dispatch(login(action.payload.value));
    const state = getState();
    const location = getLocation(state);

    return dispatch(push({ ...location, pathname: "/update-factor/success" }));
  });
