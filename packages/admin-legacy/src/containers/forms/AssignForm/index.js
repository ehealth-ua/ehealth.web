import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Form, reduxForm, Field, getFormValues } from "redux-form";
import FieldSelect from "../../../components/reduxForm/FieldSelect";
import {
  assignContract,
  fetchContractEmployees
} from "../../../redux/contracts";

import styles from "./styles.module.css";

class AssignForm extends React.Component {
  state = {
    employees: [],
    errorMessage: null
  };
  async componentDidMount() {
    try {
      const {
        payload: { data: employees }
      } = await this.props.fetchContractEmployees({
        employee_type: "NHS"
      });
      this.setState({
        employees
      });
    } catch (e) {
      console.error(e);
    }
  }
  render() {
    const { id, handleSubmit, onSubmit = () => {} } = this.props;
    const fullName = obj =>
      [obj.last_name, obj.first_name, obj.second_name].join(" ");
    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.form}>
          <Field
            name="employee_id"
            component={FieldSelect}
            options={this.state.employees.map(({ id, party }) => ({
              name: id,
              title: fullName(party)
            }))}
            labelBold
            onChange={async (e, value) => {
              const {
                payload: { message }
              } = await this.props.assignContract(id, {
                employee_id: value
              });
              this.setState({ errorMessage: message });
            }}
            error={this.state.errorMessage}
          />
        </div>
      </Form>
    );
  }
}

export default compose(
  reduxForm({
    form: "contract-request-assign-form"
  }),
  connect(
    state => ({
      values: getFormValues("contract-request-assign-form")(state)
    }),
    { fetchContractEmployees, assignContract }
  )
)(AssignForm);
