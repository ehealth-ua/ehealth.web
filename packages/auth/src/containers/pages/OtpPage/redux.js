import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
import { getLocation } from "../../../reducers";
import { otpVerifyToken, otpResendOtp, authorize } from "../../../redux/auth";
import { fetchUserData } from "../../../redux/user";
import { login } from "../../../redux/session";

export const onSubmit = ({ code }) => async (dispatch, getState) => {
  const { payload: { value: token, details, response }, meta } = await dispatch(
    otpVerifyToken(parseInt(code, 10))
  );
  if (response && response.error) {
    const { type } = response.error;
    if (type) {
      throw new SubmissionError({
        code: {
          [type]: true
        }
      });
    }
    return response.error;
  }
  dispatch(login(token));

  const state = getState();
  const { query } = getLocation(state);

  return dispatch(fetchUserData(token)).then(action => {
    if (action.error) {
      return action;
    }
    const state = getState();
    const location = getLocation(state);

    if (location.query.invite) {
      return dispatch(
        push({
          ...location,
          pathname: "/invite/accept"
        })
      );
    } else if (meta.next_step === "REQUEST_APPS") {
      return dispatch(
        authorize({
          clientId: query.client_id,
          redirectUri: query.redirect_uri
        })
      ).then(({ payload, error }) => {
        if (error) {
          switch (payload.response.error.message) {
            case "The redirection URI provided does not match a pre-registered value.":
              return dispatch(push(`/sign-in/failure/wrong_url`));
            case "Invalid client id.":
              return dispatch(push(`/sign-in/failure/invalid_client_id`));
            case "User blocked.":
              return dispatch(push(`/sign-in/failure/access_denied`));
            case "Requested scope is empty. Scope not passed or user has no roles or global roles.": {
              return dispatch(push(`/sign-in/failure/global_user_scope_error`));
            }
            default:
              return dispatch(push(`/sign-in/failure`));
          }
        }
        return window && (window.location = payload.headers.get("location"));
      });
    } else
      return dispatch(
        push({
          ...location,
          pathname: "/accept"
        })
      );
  });
};

export const onResend = () => (dispatch, getState) =>
  dispatch(otpResendOtp()).then(action => {
    const state = getState();
    const location = getLocation(state);
    if (action.error) {
      const { error } = action.payload.response;
      switch (error.message) {
        case "Sending OTP timeout. Try later.":
          return false;
        case "Invalid token type":
          return dispatch(
            push({ ...location, path: "/sign-in/failure/invalid_token_type" })
          );
      }
    }
    dispatch(login(action.payload.value));
    return action;
  });
