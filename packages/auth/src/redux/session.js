import { createAction, handleActions } from "redux-actions";
import Cookies from "js-cookie";

const AUTH_COOKIE_NAME = "authorization";

export const getToken = () => (dispatch, getState) =>
  Cookies.get(AUTH_COOKIE_NAME);
export const setToken = token => (dispatch, getState) =>
  Cookies.set(AUTH_COOKIE_NAME, token);
export const removeToken = () => (dispatch, getState) =>
  Cookies.remove(AUTH_COOKIE_NAME);

export const isAuthenticated = () => dispatch =>
  dispatch(getToken()).then(resp => !!resp);

export const logoutAction = createAction("session/LOGOUT");
export const setData = createAction("session/SET_DATA");

export const loadTokenFromStorage = () => (dispatch, getState) =>
  dispatch(
    setData({
      token: Cookies.get(AUTH_COOKIE_NAME)
    })
  );

export const logout = () => dispatch =>
  dispatch(removeToken()).then(() => dispatch(logoutAction()));

export const login = token => dispatch =>
  dispatch([setToken(token), setData({ token })]);

export default handleActions(
  {
    [setData]: (state, action) => action.payload,
    [logoutAction]: () => ({})
  },
  {}
);
