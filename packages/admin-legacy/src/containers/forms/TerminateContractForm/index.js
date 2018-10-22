import React from "react";
import { compose } from "redux";
import { reduxForm, Field } from "redux-form";
import { reduxFormValidate } from "react-nebo15-validate";

import Button from "../../../components/Button";
import FieldTextarea from "../../../components/reduxForm/FieldTextarea";

import ShowWithScope from "../../blocks/ShowWithScope";

import styles from "./styles.module.css";

const TerminateFormView = ({
  toggleTerminate,
  terminateContract,
  values,
  handleSubmit
}) => {
  return (
    <form id="contract-terminate-form" onSubmit={handleSubmit}>
      <br />
      <div className={styles.form}>
        <div>
          <div className={styles.label}>Причина відхилення запиту</div>
          <Field
            name="status_reason"
            component={FieldTextarea}
            placeholder="Будь ласка, вкажіть причину (обов’язкове поле)"
          />
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <div className={styles.button}>
          <Button
            theme="border"
            size="middle"
            color="red"
            onClick={toggleTerminate}
          >
            Відміна
          </Button>
        </div>
        <div className={styles.button}>
          <Button type="submit" size="middle" color="red">
            Завершити договір
          </Button>
        </div>
      </div>
    </form>
  );
};

const TerminateForm = compose(
  reduxForm({
    form: "contract-terminate-form",
    validate: reduxFormValidate({
      status_reason: {
        required: true
      }
    })
  })
)(TerminateFormView);

export default class TerminateContractForm extends React.Component {
  state = {
    terminate: false
  };
  render() {
    const { id, terminateContract } = this.props;
    return (
      <ShowWithScope scope="contract:terminate">
        <div>
          <div className={styles.button}>
            <Button
              size="middle"
              color="red"
              type="button"
              onClick={() =>
                this.setState({
                  terminate: !this.state.terminate
                })
              }
            >
              Завершити договір
            </Button>
          </div>
          {this.state.terminate && (
            <TerminateForm
              onSubmit={async values => {
                terminateContract(id, {
                  status_reason: values.status_reason
                });
              }}
              toggleTerminate={this.toggleTerminate}
            />
          )}
        </div>
      </ShowWithScope>
    );
  }
  toggleTerminate = () => this.setState({ terminate: !this.state.terminate });
}
