import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { H1, H3 } from "../../../components/Title";
import ResetPasswordForm from "../../forms/ResetPasswordForm";
import Button, { ButtonsGroup } from "../../../components/Button";

import { onSubmit } from "./redux";
import styles from "./styles.module.css";

class ResetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.onClickResend = this.onClickResend.bind(this);
    this.state = {
      isSend: false,
      email: "",
      timer: ""
    };
    this.interval = null;
  }

  componentWillUnmount() {
    this.setState({
      isSend: false,
      email: ""
    });
    clearInterval(this.interval);
  }

  onClickResend() {
    this.interval = setInterval(() => {
      this.state.timer > 1
        ? this.setState({ timer: this.state.timer - 1 })
        : this.setState({ timer: 0 });

      if (this.state.timer === 0) clearInterval(this.interval);
    }, 1000);
  }

  render() {
    const { onSubmit } = this.props;
    return (
      <section className={styles.main} id="reset-password-in-page">
        <header className={styles.header}>
          <H1>Відновлення паролю до системи eHealth</H1>
        </header>
        {!this.state.isSend && (
          <article className={styles.form}>
            <ResetPasswordForm
              onSubmit={v => {
                this.setState({ email: v.email });
                return onSubmit(v).then(
                  a => !a.error && this.setState({ isSend: true })
                );
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
              <Button
                theme="link"
                disabled={this.state.timer > 0}
                onClick={() =>
                  onSubmit({ email: this.state.email }).then(() => {
                    this.setState({ timer: 10 });
                    return this.onClickResend();
                  })
                }
              >
                {this.state.timer
                  ? `Надіслати повторно через ${this.state.timer} сек`
                  : "Надіслати повторно"}
              </Button>
            </ButtonsGroup>
          </div>
        )}
      </section>
    );
  }
}

export default compose(withRouter, connect(null, { onSubmit }))(
  ResetPasswordPage
);
