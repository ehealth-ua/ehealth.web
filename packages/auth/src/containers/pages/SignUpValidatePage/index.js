import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import { Switch } from "@ehealth/components";
import Button from "../../../components/Button";
import env from "../../../env";
import { getToken } from "../../../reducers";
import { setData, logoutAction } from "../../../redux/session";
import { validateEmail, getUser } from "../../../redux/cabinet";
import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";
import DigitalSignatureForm from "../../forms/DigitalSignatureForm";

class SignUpValidatePage extends Component {
  state = {
    tokenExchangeState: "pending"
  };

  async componentDidMount() {
    const {
      location: {
        query: { token }
      },
      setData,
      logoutAction,
      validateEmail
    } = this.props;

    await setData({ token });
    const {
      error,
      payload: { data, response }
    } = await validateEmail();

    if (error) {
      await logoutAction();
      this.setState({ tokenExchangeState: response.error.type });
    } else {
      await setData(data);
      this.setState({ tokenExchangeState: "success" });
    }
  }

  render() {
    return (
      <Main>
        <Header>
          <H1>Реєстрація</H1>
        </Header>
        <Article>
          <Switch
            value={this.state.tokenExchangeState}
            success={
              <NarrowContainer>
                <p>За допомогою Електронного Цифрового Підпису</p>
                <DigitalSignatureForm onSubmit={this.handleSubmit} />
              </NarrowContainer>
            }
            jwt_expired={
              <>
                <p>Час дії посилання вичерпався.</p>
                <p>Будь ласка, відправте форму повторно.</p>
                <Link to="/sign-up">
                  <Button>Відправити повторно</Button>
                </Link>
              </>
            }
            email_exists={
              <>
                <p>Ви вже скористались цим посиланням.</p>
                <p>Будь ласка, увійдіть.</p>
                <Link to="/sign-in">
                  <Button>Увійти</Button>
                </Link>
              </>
            }
            access_denied={
              <>
                <p>Некоректне посилання. У доступі відмовлено.</p>
                <p>Будь ласка, перевірте правильність посилання.</p>
              </>
            }
          />
        </Article>
      </Main>
    );
  }

  handleSubmit = async ds => {
    const { token, location, router, getUser } = this.props;

    const content = JSON.stringify({ token });
    const signed_content = env.REACT_APP_DIGITAL_SIGNATURE_ENABLED
      ? ds.SignDataInternal(true, content, true)
      : btoa(unescape(encodeURIComponent(content)));

    const {
      error,
      payload: { response }
    } = await getUser({
      signed_content,
      drfo: ds.privKeyOwnerInfo.subjDRFOCode
    });

    if (error) {
      router.push({
        ...location,
        pathname: `/sign-up/failure/${response.error.type}`
      });
    } else {
      router.push({ ...location, pathname: "/sign-up/person" });
    }
  };
}

export default connect(
  state => ({ token: getToken(state) }),
  {
    setData,
    logoutAction,
    validateEmail,
    getUser
  }
)(SignUpValidatePage);
