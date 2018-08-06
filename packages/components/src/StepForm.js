import React, { Component } from "react";
import { pickProps } from "@ehealth/utils";

import Form from "./Form";

const STEP_FORM_PROPS = ["initialValues", "step", "transitions", "onSubmit"];

export default class StepForm extends Component {
  state = {
    values: this.props.initialValues
  };

  render() {
    const [props] = pickProps(this.props, STEP_FORM_PROPS);

    return (
      <Form
        {...props}
        initialValues={this.state.values}
        onSubmit={this.handleSubmit}
      />
    );
  }

  handleSubmit = (values, form) => {
    const { step, transitions, onSubmit } = this.props;
    const transition = transitions[step];

    this.setState({ values });

    const { submitErrors } = form.getState();

    return transition
      ? transition(values, form) || submitErrors
      : onSubmit(values, form);
  };
}
