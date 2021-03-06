import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter, Link } from "react-router";
import env from "../../../env";

import { SUBMIT_ERROR } from "@ehealth/components";
import Button from "../../../components/Button";
import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";
import DigitalSignatureForm from "../../forms/DigitalSignatureForm";

import { getNonce, createSessionToken, authorize } from "../../../redux/auth";
import { login } from "../../../redux/session";

class SignInDSPage extends Component {
  render() {
    const { location } = this.props;
    return (
      <Main>
        <Header>
          <H1>вхід до системи</H1>
        </Header>
        <Article>
          <NarrowContainer>
            <p>
              за допомогою <br /> Електронного Цифрового Підпису
            </p>
            <DigitalSignatureForm onSubmit={this.handleSubmit} />
            <Link to={`/sign-in/${location.search}`}>
              <Button theme="link" block>
                Увійти за допомогою email
              </Button>
            </Link>
          </NarrowContainer>
        </Article>
      </Main>
    );
  }
  handleSubmit = async ds => {
    const {
      getNonce,
      createSessionToken,
      login,
      authorize,
      location: { query, search },
      router
    } = this.props;
    const {
      payload: { data: { token } = {}, response = {} }
    } = await getNonce(query.client_id);

    // with not valid client_id
    if (response.error && response.error.type === "not_found") {
      return router.push(`/sign-in/failure/invalid_client_id`);
    }

    login(token);
    const content = JSON.stringify({ jwt: token });
    const signed_content = env.REACT_APP_DIGITAL_SIGNATURE_ENABLED
      ? ds.SignDataInternal(true, content, true)
      : btoa(content);
    const drfo = env.REACT_APP_DIGITAL_SIGNATURE_ENABLED
      ? undefined
      : ds.privKeyOwnerInfo.subjDRFOCode;

    const {
      payload: { value, response: { error: error_body } = {} },
      meta: { next_step } = {},
      error: token_error
    } = await createSessionToken({
      drfo,
      signed_content,
      client_id: env.REACT_APP_CLIENT_ID,
      grant_type: "digital_signature",
      signed_content_encoding: "base64",
      scope: "app:authorize"
    });
    if (token_error) {
      if (error_body.type === "validation_failed") {
        return { [SUBMIT_ERROR]: token_error.invalid };
      }
      return router.push(`/sign-in/failure/${error_body.type}${search}`);
    }

    login(value);

    if (next_step === "REQUEST_APPS") {
      authorize({
        clientId: query.client_id,
        redirectUri: query.redirect_uri
      }).then(({ payload, error }) => {
        if (error) {
          switch (payload.response.error.message) {
            case "The redirection URI provided does not match a pre-registered value.":
              return router.push(`/sign-in/failure/wrong_url`);
            case "Invalid client id.":
              return router.push("/sign-in/failure/invalid_client_id");
            case "Requested scope is empty. Scope not passed or user has no roles or global roles.":
              return router.push("/sign-in/failure/global_user_scope_error");
            default:
              router.push(`/sign-in/failure`);
          }
        }
        return window && (window.location = payload.headers.get("location"));
      });
    }
  };
}

export default compose(
  withRouter,
  connect(
    null,
    {
      getNonce,
      createSessionToken,
      login,
      authorize
    }
  )
)(SignInDSPage);
