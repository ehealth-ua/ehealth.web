import React from "react";
import { reduxForm, Field } from "redux-form";

import FieldInput from "../../../components/reduxForm/FieldInput";
import Button from "../../../components/Button";
import { FormRow, FormColumn } from "../../../components/Form";

import ShowWithScope from "../../blocks/ShowWithScope";

import { reduxFormValidate } from "react-nebo15-validate";

import { BackIcon } from "@ehealth/icons";

class BlackUserCreateForm extends React.Component {
  render() {
    const { handleSubmit, onSubmit = () => {}, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRow>
          <FormColumn>
            <Field
              name="tax_id"
              labelText="ІНН Користувача"
              component={FieldInput}
              placeholder="2848165412"
            />
          </FormColumn>
          <FormColumn />
        </FormRow>
        <FormRow>
          <FormColumn>
            <Button
              to="/black-list-users"
              theme="border"
              color="blue"
              icon={<BackIcon width="20" height="12" />}
              block
            >
              Повернутися до списку
            </Button>
          </FormColumn>
          <FormColumn>
            <ShowWithScope scope="bl_user:write">
              <div>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Збереження" : "Заблокувати користувача"}
                </Button>
              </div>
            </ShowWithScope>
          </FormColumn>
        </FormRow>
      </form>
    );
  }
}

export default reduxForm({
  form: "black-user-create-form",
  validate: reduxFormValidate({
    tax_id: {
      length: 10
    }
  })
})(BlackUserCreateForm);
