import { push } from "react-router-redux";

import { setData, logoutAction } from "../../../redux/session";
import { validateEmail, getUser } from "../../../redux/cabinet";

export const exchangeToken = ({ token }) => async dispatch => {
  await dispatch(setData({ token }));
  const { error, payload: { data, response } } = await dispatch(
    validateEmail()
  );

  console.log(response);

  if (error) {
    await dispatch(logoutAction());
    throw response.error;
  } else {
    return dispatch(setData(data));
  }
};

export const checkSignUpAbility = ({
  signed_content,
  drfo
}) => async dispatch => {
  const { error, payload: { response } } = await dispatch(
    getUser({
      signed_content,
      drfo,
      signed_content_encoding: "base64"
    })
  );

  if (error) {
    return dispatch(
      push({ pathname: `/sign-up/failure/${response.error.type}` })
    );
  } else {
    return dispatch(push({ pathname: "/sign-up/next/person" }));
  }
};
