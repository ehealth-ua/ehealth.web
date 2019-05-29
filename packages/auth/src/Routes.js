import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Router,
  Route,
  IndexRedirect,
  IndexRoute,
  browserHistory,
  applyRouterMiddleware
} from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import { useRedial } from "react-router-redial";

import env from "./env";

import { getUser, getToken, getLocation } from "./reducers";
import { loadTokenFromStorage, isAuthenticated, logout } from "./redux/session";
import { fetchUserData } from "./redux/user";

import Main from "./containers/layouts/Main";
import Default from "./containers/layouts/Default";
import FAQ from "./containers/layouts/FAQ";
import InviteLayout from "./containers/layouts/InviteLayout";
import DigitalSignatureProvider from "./containers/layouts/DigitalSignatureProvider";

import SignPage from "./containers/pages/SignPage";
import StampPage from "./containers/pages/StampPage";

import SignUpVerifyPage from "./containers/pages/SignUpVerifyPage";
import SignUpConfirmationPage from "./containers/pages/SignUpConfirmationPage";
import SignUpValidatePage from "./containers/pages/SignUpValidatePage";
import SignUpFailurePage from "./containers/pages/SignUpFailurePage";
import SignUpNextPage from "./containers/pages/SignUpNextPage";
import SignUpPersonPage from "./containers/pages/SignUpPersonPage";
import SignUpUserPage from "./containers/pages/SignUpUserPage";
import SignUpOtpPage from "./containers/pages/SignUpOtpPage";

import InvitePage from "./containers/pages/InvitePage";
import InviteAcceptPage from "./containers/pages/InviteAcceptPage";
import InviteSuccessPage from "./containers/pages/InviteSuccessPage";
import InviteRejectPage from "./containers/pages/InviteRejectPage";

import SignInPage from "./containers/pages/SignInPage";
import SignInDSPage from "./containers/pages/SignInDSPage";
import SignInFailurePage from "./containers/pages/SignInFailurePage";

import OtpPage from "./containers/pages/OtpPage";
import AcceptPage from "./containers/pages/AcceptPage";
import ConditionPage from "./containers/pages/ConditionPage";

import RequestFactorPage from "./containers/pages/RequestFactorPage";
import RequestFactorApprovePage from "./containers/pages/RequestFactorApprovePage";

import ResetPasswordPage from "./containers/pages/ResetPasswordPage";
import NewPasswordPage from "./containers/pages/NewPasswordPage";

import UpdateFactorSignInPage from "./containers/pages/UpdateFactorSignInPage";
import UpdateFactorOtpPage from "./containers/pages/UpdateFactorOtpPage";
import UpdateFactorPhonePage from "./containers/pages/UpdateFactorPhonePage";
import UpdateFactorPhoneOtpPage from "./containers/pages/UpdateFactorPhoneOtpPage";
import UpdateFactorSuccessPage from "./containers/pages/UpdateFactorSuccessPage";

import PasswordExpiredSignInPage from "./containers/pages/PasswordExpiredSignInPage";
import PasswordExpiredPage from "./containers/pages/PasswordExpiredPage";
import PasswordExpiredOtpPage from "./containers/pages/PasswordExpiredOtpPage";
import UpdatePasswordSuccessPage from "./containers/pages/UpdatePasswordSuccessPage";

import PasswordRequestFactorPage from "./containers/pages/PasswordRequestFactorPage";
import PasswordRequestFactorApprovePage from "./containers/pages/PasswordRequestFactorApprovePage";

import NotFoundPage from "./containers/pages/NotFoundPage";

export default class Routes extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.context.store.dispatch(loadTokenFromStorage());
  }

  render() {
    const { store } = this.context;
    const { dispatch, getState } = store;

    const history = syncHistoryWithStore(browserHistory, store);

    return (
      <Router
        history={history}
        render={applyRouterMiddleware(
          useRedial({
            locals: { dispatch, getState },
            beforeTransition: ["fetch"],
            afterTransition: ["defer", "done"],
            parallel: true,
            initialLoading: () => null,
            onCompleted: transition =>
              transition === "beforeTransition" && window.scrollTo(0, 0)
          })
        )}
      >
        <Route component={Main}>
          <Route path="/">
            <Route component={FAQ}>
              <Route path="conditions" component={ConditionPage} />
            </Route>

            <Route component={Default}>
              <Route component={DigitalSignatureProvider}>
                <Route path="sign" component={SignPage} />
                <Route path="stamp" component={StampPage} />
              </Route>

              {env.REACT_APP_SIGN_UP_ENABLED && (
                <>
                  <Route path="sign-up" component={SignUpVerifyPage} />
                  <Route
                    path="sign-up/confirmation"
                    component={SignUpConfirmationPage}
                  />
                  <Route component={DigitalSignatureProvider}>
                    <Route
                      path="/sign-up/continue"
                      component={SignUpValidatePage}
                    />
                    <Route component={SignUpNextPage}>
                      <Route
                        path="/sign-up/person"
                        component={SignUpPersonPage}
                      />
                      <Route path="/sign-up/user" component={SignUpUserPage} />
                      <Route path="/sign-up/otp" component={SignUpOtpPage} />
                    </Route>
                    <Route
                      path="/sign-up/failure/:type"
                      component={SignUpFailurePage}
                    />
                  </Route>
                </>
              )}

              <Route path="invite" component={InviteLayout}>
                <IndexRoute inviteStatuses={["NEW"]} component={InvitePage} />
                <Route
                  path="accept"
                  inviteStatuses={["NEW"]}
                  component={InviteAcceptPage}
                />
                <Route
                  path="success"
                  inviteStatuses={["APPROVED"]}
                  component={InviteSuccessPage}
                />
                <Route
                  path="reject"
                  inviteStatuses={["REJECTED"]}
                  component={InviteRejectPage}
                />
              </Route>

              <Route onEnter={this.bypassAuthenticated}>
                <Route path="sign-in" component={SignInPage} />

                <Route component={DigitalSignatureProvider}>
                  <Route
                    path="sign-in/digital-signature"
                    component={SignInDSPage}
                  />
                </Route>
              </Route>

              <Route
                path="/sign-in/failure/:type"
                component={SignInFailurePage}
              />

              <Route
                path="update-password"
                component={PasswordExpiredSignInPage}
              />
              <Route
                path="update-password/new"
                component={PasswordExpiredPage}
              />
              <Route
                path="update-password/otp"
                component={PasswordExpiredOtpPage}
              />
              <Route
                path="update-password/factor"
                component={PasswordRequestFactorPage}
              />
              <Route
                path="update-password/factor/approve"
                component={PasswordRequestFactorApprovePage}
              />
              <Route
                path="update-password/success"
                component={UpdatePasswordSuccessPage}
              />
              <Route path="update-factor" component={UpdateFactorSignInPage} />
              <Route path="reset" component={ResetPasswordPage} />
              <Route path="reset/:id" component={NewPasswordPage} />

              <Route onEnter={this.requireAuth}>
                <Route path="accept" component={AcceptPage} />
                <Route path="otp-send" component={OtpPage} />

                <Route path="request-factor" component={RequestFactorPage} />
                <Route
                  path="request-factor/approve"
                  component={RequestFactorApprovePage}
                />

                <Route
                  path="update-factor/otp"
                  component={UpdateFactorOtpPage}
                />
                <Route
                  path="update-factor/phone"
                  component={UpdateFactorPhonePage}
                />
                <Route
                  path="update-factor/phone/otp"
                  component={UpdateFactorPhoneOtpPage}
                />
                <Route
                  path="update-factor/success"
                  component={UpdateFactorSuccessPage}
                />
              </Route>

              <Route path="*" component={NotFoundPage} />
            </Route>

            <IndexRedirect to="sign-in" />
          </Route>
        </Route>
      </Router>
    );
  }

  requireAuth = async (nextState, replace, next) => {
    const { dispatch, getState } = this.context.store;

    const authenticated = await dispatch(isAuthenticated());

    if (!authenticated) {
      replace({ pathname: "/" });
      return next();
    }

    const currentState = getState();
    const person = getUser(currentState);

    if (person) return next();

    const { error } = await dispatch(fetchUserData(getToken(currentState)));

    if (error) {
      dispatch(logout());
      replace({ pathname: "/" });
    }

    return next();
  };

  bypassAuthenticated = async (nextState, replace, next) => {
    const { dispatch, getState } = this.context.store;

    const authenticated = await dispatch(isAuthenticated());

    if (authenticated) {
      const state = getState();
      const location = getLocation(state);

      replace({ ...location, pathname: "/accept" });
      return next();
    }

    return next();
  };
}
