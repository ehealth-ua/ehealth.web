import { push } from "react-router-redux";

import { verifyEmail } from "../../../redux/cabinet";
import { getLocation } from "../../../reducers";

export const onSubmit = ({ email }) => async dispatch => {
  const { error } = await dispatch(verifyEmail({ email }));

  if (!error) {
    return dispatch(
      push({ pathname: "/sign-up/confirmation", query: { email } })
    );
  }
};
