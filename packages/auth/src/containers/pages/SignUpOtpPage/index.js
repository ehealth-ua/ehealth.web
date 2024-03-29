import React, { Component } from "react";
import PropTypes from "prop-types";
import Composer from "react-composer";
import {
  Field,
  Form,
  Validation,
  Validations,
  Connect,
  StateMachine,
  Switch
} from "@ehealth/components";
import styled from "@emotion/styled";
import { Link } from "react-router";
import {
  Main,
  Header,
  Article,
  NarrowContainer
} from "../../../components/CenterLayout";
import { H1 } from "../../../components/Title";
import { sendOtp } from "../../../redux/cabinet";

export default class SignUpOtpPage extends Component {
  static contextTypes = {
    reactFinalForm: PropTypes.object
  };

  componentDidMount() {
    this.context.reactFinalForm.change("otp", "");
  }

  render() {
    const { router, location } = this.props;

    return (
      <Main>
        <Header>
          <H1>OTP-пароль</H1>
        </Header>
        <Article>
          <NarrowContainer>
            <p>Будь ласка, введіть 4 цифри, отримані вами у СМС-повідомленні</p>
            <Field.Input name="otp" placeholder="4 цифри з СМС" />
            <Validations field="otp">
              <Validation.Required message="Об'язкове поле" />
              <Validation.Numeric message="Дозволені тільки цифри" />
              <Validation.Length
                options={{ min: 4, max: 4 }}
                message="Довжина становить 4 символи"
              />
              <Validation.Submit message="Невірний код" />
            </Validations>
            <Form.Submit block>Відправити</Form.Submit>
            <Footer>
              <Link to={{ ...location, pathname: "/sign-up/user" }}>Назад</Link>

              <Composer
                components={[
                  <Connect mapDispatchToProps={{ sendOtp }} />,
                  <Field
                    name="person.authentication_methods[0].phone_number"
                    subscription={{ value: true }}
                  />
                ]}
              >
                {([
                  { sendOtp },
                  {
                    input: { value: factor }
                  }
                ]) => (
                  <ResendLink
                    onClick={async () => {
                      const {
                        error,
                        payload: { response }
                      } = await sendOtp({
                        factor,
                        type: "SMS"
                      });

                      if (error) {
                        router.push({
                          ...location,
                          pathname: `/sign-up/failure/${response.error.type}`
                        });
                      }
                    }}
                  />
                )}
              </Composer>
            </Footer>
          </NarrowContainer>
        </Article>
      </Main>
    );
  }
}

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ResendLink = ({ onClick }) => (
  <StateMachine
    initialState="pending"
    transitions={{
      async sending() {
        await onClick();
        return "sent";
      },
      async sent() {
        await new Promise(r => setTimeout(r, 30000));
        return "pending";
      }
    }}
  >
    {({ state, transition }) => (
      <Link
        disabled={state !== "pending"}
        onClick={() => {
          if (state === "pending") transition("sending");
        }}
      >
        <Switch
          value={state}
          pending="Відправити знову"
          sending="Відправляємо..."
          sent="Відправлено"
        />
      </Link>
    )}
  </StateMachine>
);
