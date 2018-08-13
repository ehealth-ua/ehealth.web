import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";

import { reduxForm, Field, getFormValues } from "redux-form";
import { reduxFormValidate, ErrorMessage } from "react-nebo15-validate";
import ReactFileReader from "react-file-reader";

import FieldTextarea from "../../../components/reduxForm/FieldTextarea";

import Button from "../../../components/Button";
import { FormRow, FormColumn } from "../../../components/Form";
import { SelectUniversal } from "../../../components/SelectUniversal";
import LoadingDot from "../../../components/LoadingDot";

import ShowWithScope from "../../blocks/ShowWithScope";
import { ENTITY_TYPE } from "../../../helpers/enums";

import styles from "./styles.module.css";

class RegisterUploadForm extends React.Component {
  state = {
    file_name: null,
    file: null,
    pending: false
  };

  handleFiles = file => {
    this.setState(() => ({
      file: file.base64,
      file_name: file.fileList[0].name
    }));
  };

  onSubmit({ entity_type, type, reason_description }) {
    const { file, file_name } = this.state;
    return this.props
      .onSubmit({
        entity_type: entity_type.name,
        type: type.name,
        file: file.replace("data:text/csv;base64,", ""),
        file_name,
        reason_description
      })
      .then(resp =>
        this.setState({
          pending: false
        })
      );
  }

  render() {
    const { handleSubmit, data: { registerTypes }, submitting } = this.props;
    const { file, file_name } = this.state;

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
              <ReactFileReader
                fileTypes={[".csv"]}
                base64={true}
                multipleFiles={false}
                handleFiles={this.handleFiles}
              >
                <Button size="small" color="blue">
                  Завантажити файл
                </Button>
                {file_name && (
                  <span>
                    <b>{` ${file_name}*`}</b>
                  </span>
                )}
              </ReactFileReader>
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <ShowWithScope scope="register:write">
                <div>
                  <Button
                    type="submit"
                    disabled={!file && !file_name && submitting}
                  >
                    {this.state.pending && (
                      <div>
                        Зачекайте. Йде завантаження файлу{" "}
                        <LoadingDot align="center" />
                      </div>
                    )}
                    {!file && !file_name && "Завантажте файл"}
                    {!this.state.pending &&
                      file &&
                      file_name &&
                      "Зберегти файл"}
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
      }
    })
  }),
  connect(state => ({
    values: getFormValues("register-upload-form")(state)
  }))
)(RegisterUploadForm);
