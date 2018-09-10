import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { SUBMIT_ERROR, StateMachine, Link, Switch } from "@ehealth/components";
import { passwordRecoveryRequest } from "../../../redux/password";

import { H1, H3 } from "../../../components/Title";
import ResetPasswordForm from "../../forms/ResetPasswordForm";
import Button, { ButtonsGroup } from "../../../components/Button";

import styles from "./styles.module.css";

class ResetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSend: false,
      email: ""
    };
  }

  componentWillUnmount() {
    this.setState({
      isSend: false,
      email: ""
    });
  }

  render() {
    const {
      passwordRecoveryRequest,
      router: {
        location: {
          query: { client_id, redirect_uri }
        }
      }
    } = this.props;
    return (
      <section className={styles.main} id="reset-password-in-page">
        <header className={styles.header}>
          <H1>Відновлення паролю до системи eHealth</H1>
        </header>
        {!this.state.isSend && (
          <article className={styles.form}>
            <ResetPasswordForm
              onSubmit={async ({ email }) => {
                this.setState({ email });

                const {
                  payload: { error },
                  response
                } = await passwordRecoveryRequest(
                  email,
                  client_id,
                  redirect_uri
                );
                if (error) {
                  if (response.error.type === "validation_failed") {
                    return { [SUBMIT_ERROR]: response.error.invalid };
                  }
                } else this.setState({ isSend: true });
              }}
            />
          </article>
        )}
        {this.state.isSend && (
          <div className={styles.form}>
            <div className={styles.description}>
              <H3>На ваш email було надісладно листа для відновлення паролю</H3>
            </div>
            <ButtonsGroup>
              <ResendLink
                onClick={async () => {
                  await passwordRecoveryRequest(
                    this.state.email,
                    client_id,
                    redirect_uri
                  );
                }}
              />
            </ButtonsGroup>
          </div>
        )}
      </section>
    );
  }
}

const ResendLink = ({ onClick }) => (
  <StateMachine
    initialState="pending"
    transitions={{
      async sending() {
        await onClick();
        return "sent";
      },
      async sent() {
        await new Promise(r => setTimeout(r, 10000));
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

export default compose(
  withRouter,
  connect(
    null,
    { passwordRecoveryRequest }
  )
)(ResetPasswordPage);
