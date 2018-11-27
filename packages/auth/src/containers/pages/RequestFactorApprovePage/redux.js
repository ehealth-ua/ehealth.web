import { push } from "react-router-redux";
import { SubmissionError } from "redux-form";
import { getLocation } from "../../../reducers";
import { approveFactor } from "../../../redux/factors";
import { login } from "../../../redux/session";
import { authorize } from "../../../redux/auth";
import env from "../../../env";

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
    if (location.query && location.query.password_update) {
      return dispatch(
        push({
          ...location,
          pathname: "update-password/new"
        })
      );
    } else if (location.query.invite) {
      return dispatch(
        push({
          ...location,
          pathname: "/invite/accept"
        })
      );
    } else if (location.query.client_id === env.REACT_APP_CLIENT_ID) {
      return dispatch(
        authorize({
          clientId: location.query.client_id,
          redirectUri: location.query.redirect_uri
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
            default:
              dispatch(push(`/sign-in/failure`));
          }
        }
        return window && (window.location = payload.headers.get("location"));
      });
    } else {
      return dispatch(push({ ...location, pathname: "/accept" }));
    }
  });
