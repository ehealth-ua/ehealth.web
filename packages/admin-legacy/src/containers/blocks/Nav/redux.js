import { push } from "react-router-redux";
import { logout } from "../../../redux/session";

export const logOut = () => dispatch =>
  dispatch(push("/sign-in")).then(() => dispatch(logout()));
