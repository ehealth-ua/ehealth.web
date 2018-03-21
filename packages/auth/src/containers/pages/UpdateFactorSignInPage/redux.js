import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
import { createSessionToken } from "../../../redux/auth";
import { login } from "../../../redux/session";
import { getLocation } from "../../../reducers";
import { REACT_APP_CLIENT_ID } from "../../../env";
import error_messages from "../../../helpers/errors";

export const onSubmit = ({ email, password }) => (dispatch, getState) =>
  dispatch(
    createSessionToken({
      grant_type: "password",
      email,
      password,
      client_id: REACT_APP_CLIENT_ID,
      scope: "app:authorize"
    })
  ).then(action => {
    if (action.error) {
      const { message } = action.payload.response.error;
      const error = error_messages[message] || error_messages.defaultError;

      throw new SubmissionError({ email: { [error]: true } });
    }
    const { next_step } = action.meta;
    if (next_step !== "REQUEST_OTP") {
      throw new SubmissionError({
        email: {
          notAllowed: true
        }
      });
    }
    dispatch(login(action.payload.value));
    const state = getState();
    const location = getLocation(state);
    return dispatch(push({ ...location, pathname: "/update-factor/otp" }));
  });
