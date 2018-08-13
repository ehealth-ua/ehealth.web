import React from "react";
import { Field } from "redux-form";
import { ErrorMessage } from "react-nebo15-validate";

import FieldInput from "../../../components/reduxForm/FieldInput";
import RadioInput from "../../../components/RadioInput";

import { SelectUniversal } from "../../../components/SelectUniversal";
import { FormRow, FormColumn } from "../../../components/Form";
import Button from "../../../components/Button";
import Line from "../../../components/Line";
import { ThinAddIcon } from "@ehealth/icons";

export default class RenderIngredient extends React.Component {
  state = {
    innms_search: ""
  };

  render() {
    const {
      fields,
      meta: { error, submitFailed },
      data,
      onSearchInnms = () => {},
      onSearchChange = () => {}
    } = this.props;
    return (
      <ul>
        {fields.map((ingredient, index) => (
          <li key={index}>
            <br />
            <FormRow>
              <FormColumn align="baseline">
                <Field
                  name={`${ingredient}.id`}
                  component={SelectUniversal}
                  labelText="Назва речовини"
                  emptyText="Не знайдено"
                  placeholder="Почніть вводити назву"
                  label_bold
                  searchable
                  onChangeSearch={v =>
                    v &&
                    onSearchInnms(v.toLowerCase()).then(() =>
                      onSearchChange(v.toLowerCase())
                    )
                  }
                  options={data.innms
                    .filter(i => i.is_active)
                    .filter(
                      i =>
                        new RegExp(this.state.innms_search).test(
                          i.name.toLowerCase()
                        ) === true
                    )
                    .map(i => ({
                      name: i.id,
                      title: i.name
                    }))}
                >
                  <ErrorMessage when="required">
                    Обов&#700;язкове поле
                  </ErrorMessage>
                </Field>
              </FormColumn>
              <FormColumn align="baseline">
                <RadioInput
                  name="is_primary"
                  value={index + 1}
                  selected={this.props.active === index + 1}
                  onChange={v => this.props.onChange(v)}
                >
                  Активна речовина
                </RadioInput>
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn size="1/4">
                <Field
                  type="number"
                  name={`${ingredient}.numerator_value`}
                  labelText="Кількість"
                  component={FieldInput}
                  label_bold
                  placeholder="0-1000"
                />
              </FormColumn>
              <FormColumn size="1/3">
                <Field
                  name={`${ingredient}.numerator_unit`}
                  component={SelectUniversal}
                  labelText="Одиниці"
                  options={Object.keys(data.medication_unit.values).map(i => ({
                    title: data.medication_unit.values[i],
                    name: i
                  }))}
                >
                  <ErrorMessage when="required">
                    Обов&#700;язкове поле
                  </ErrorMessage>
                </Field>
              </FormColumn>
              <FormColumn size="1/3">
                <Field
                  name={`${ingredient}.denumerator_unit`}
                  component={SelectUniversal}
                  labelText="На одну"
                  options={Object.keys(data.medication_unit.values).map(i => ({
                    title: data.medication_unit.values[i],
                    name: i
                  }))}
                >
                  <ErrorMessage when="required">
                    Обов&#700;язкове поле
                  </ErrorMessage>
                </Field>
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
        ))}
        <li>
          <br />
          <Button
            theme="border"
            size="small"
            color="orange"
            icon={<ThinAddIcon />}
            onClick={() => fields.push({})}
          >
            Додати складову
          </Button>
          {submitFailed && error && <span>{error}</span>}
        </li>
      </ul>
    );
  }
}
