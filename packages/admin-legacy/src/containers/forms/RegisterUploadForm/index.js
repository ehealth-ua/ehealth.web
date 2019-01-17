import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";

import { reduxForm, Field, getFormValues } from "redux-form";
import { reduxFormValidate, ErrorMessage } from "react-nebo15-validate";

import FieldTextarea from "../../../components/reduxForm/FieldTextarea";
import FieldFile from "../../../components/reduxForm/FieldFile/";

import Button from "../../../components/Button";
import { FormRow, FormColumn } from "../../../components/Form";
import { SelectUniversal } from "../../../components/SelectUniversal";
import LoadingDot from "../../../components/LoadingDot";

import ShowWithScope from "../../blocks/ShowWithScope";
import { ENTITY_TYPE } from "../../../helpers/enums";

import styles from "./styles.module.css";

class RegisterUploadForm extends React.Component {
  state = {
    pending: false
  };

  getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  async onSubmit({ file, entity_type, reason_description, type, ...props }) {
    const fileBase64 = await this.getBase64(file);
    const [dataType, baseString] = fileBase64.split("base64,");
    return this.props
      .onSubmit({
        entity_type: entity_type.name,
        type: type.name,
        file: baseString,
        file_name: file.name,
        reason_description
      })
      .then(resp =>
        this.setState({
          pending: false
        })
      );
  }

  render() {
    const {
      handleSubmit,
      data: { registerTypes },
      submitting
    } = this.props;
    return (
      <form
        onSubmit={handleSubmit(v => {
          this.setState({ pending: true });
          return this.onSubmit(v);
        })}
      >
        <div className={styles.form}>
          <FormRow>
            <FormColumn>
              <Field
                name="entity_type"
                component={SelectUniversal}
                labelText="Тип суб'єкта"
                label_bold
                placeholder="Оберіть тип суб'єкта'"
                options={Object.keys(ENTITY_TYPE).map(key => ({
                  name: key,
                  title: ENTITY_TYPE[key]
                }))}
              >
                <ErrorMessage when="required">Обов'якове поле</ErrorMessage>
              </Field>
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <Field
                name="type"
                component={SelectUniversal}
                labelText="Тип файлу"
                label_bold
                placeholder="Оберіть тип файлу"
                options={registerTypes.map(({ key, value }) => ({
                  name: key,
                  title: value
                }))}
              >
                <ErrorMessage when="required">Обов'якове поле</ErrorMessage>
              </Field>
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <Field
                name="reason_description"
                component={FieldTextarea}
                labelText="Причина дії"
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <Field name="file" component={FieldFile} />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <ShowWithScope scope="register:write">
                <div>
                  <Button type="submit" disabled={submitting}>
                    {this.state.pending ? (
                      <div>
                        Зачекайте. Йде завантаження файлу{" "}
                        <LoadingDot align="center" />
                      </div>
                    ) : (
                      "Зберегти файл"
                    )}
                  </Button>
                </div>
              </ShowWithScope>
            </FormColumn>
          </FormRow>
        </div>
      </form>
    );
  }
}

export default compose(
  reduxForm({
    form: "register-upload-form",
    validate: reduxFormValidate({
      type: {
        required: true
      },
      entity_type: {
        required: true
      },
      file: {
        required: true,
        fileType: true
      }
    })
  }),
  connect(state => ({
    values: getFormValues("register-upload-form")(state)
  }))
)(RegisterUploadForm);
