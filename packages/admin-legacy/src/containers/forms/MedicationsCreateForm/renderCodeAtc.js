import React from "react";
import { Field } from "redux-form";
import FieldInput from "../../../components/reduxForm/FieldInput";
import { FormRow, FormColumn } from "../../../components/Form";
import Button from "../../../components/Button";
import Line from "../../../components/Line";

import { ThinAddIcon } from "@ehealth/icons";

export default class RenderCodeAtx extends React.Component {
  render() {
    const {
      fields,
      meta: { error, submitFailed }
    } = this.props;

    return (
      <>
        <ul>
          {fields.map((code, index) => {
            return (
              <li key={index}>
                <br />
                <FormRow>
                  <FormColumn align="baseline">
                    <Field
                      name={code}
                      labelText="Код АТХ"
                      component={FieldInput}
                      placeholder="Введіть код АТХ"
                    />
                  </FormColumn>
                </FormRow>
                <FormRow>
                  <FormColumn>
                    <Button
                      theme="border"
                      size="small"
                      onClick={() => fields.remove(index)}
                    >
                      Відмінити
                    </Button>
                  </FormColumn>
                </FormRow>
                <Line />
              </li>
            );
          })}
        </ul>
        <br />
        <Button
          theme="border"
          size="small"
          color="orange"
          icon={<ThinAddIcon />}
          onClick={() => fields.push([])}
        >
          Додати код АТХ
        </Button>
        {submitFailed && error && <span>{error}</span>}
      </>
    );
  }
}
