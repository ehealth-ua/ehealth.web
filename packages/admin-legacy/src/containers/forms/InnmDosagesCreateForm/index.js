import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";

import {
  reduxFormValidate,
  collectionOf,
  ErrorMessage
} from "react-nebo15-validate";
import { reduxForm, Field, FieldArray, getFormValues } from "redux-form";
import ShowWithScope from "../../blocks/ShowWithScope";

import { SelectUniversal } from "../../../components/SelectUniversal";
import RadioInput from "../../../components/RadioInput";
import FieldInput from "../../../components/reduxForm/FieldInput";
import { FormRow, FormColumn } from "../../../components/Form";
import Button from "../../../components/Button";
import Line from "../../../components/Line";

import RenderIngredient from "./renderIngredient";

import styles from "./styles.module.css";

class InnmDosagesCreateForm extends React.Component {
  constructor() {
    super();
    this.state = {
      innms_search: "",
      active: 0
    };
    this.onChange = this.onChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onChange(value) {
    this.setState({
      active: value
    });
  }
  onSearchChange(value) {
    this.setState({
      innms_search: value
    });
  }

  render() {
    const {
      handleSubmit,
      onSubmit = () => {},
      onSearchInnms = () => {},
      submitting,
      disabled = false,
      data
    } = this.props;

    return (
      <form onSubmit={handleSubmit(v => onSubmit(v, this.state.active))}>
        <div className={styles.form}>
          <div className={styles.title}>&#8544;. Загальна інформація</div>
          <FormRow>
            <Field
              name="name"
              labelText="Назва"
              component={FieldInput}
              disabled={disabled}
              placeholder="Назва лікарської форми"
            />
          </FormRow>
          <FormRow>
            <FormColumn>
              <Field
                name="form"
                component={SelectUniversal}
                labelText="Форма"
                placeholder="Оберіть форму"
                options={Object.keys(data.medication_form.values).map(key => ({
                  name: key,
                  title: data.medication_form.values[key]
                }))}
              />
            </FormColumn>
          </FormRow>
          <div className={styles.title}>&#8545;. Складові</div>
          <FormRow>
            <FormColumn align="baseline">
              <Field
                name="one.ingredients.id"
                component={SelectUniversal}
                labelText="Назва речовини"
                emptyText="Не знайдено"
                placeholder="Почніть вводити назву"
                searchable
                onChangeSearch={v =>
                  v &&
                  onSearchInnms(v).then(() =>
                    this.setState({
                      innms_search: v.toLowerCase()
                    })
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
                value={0}
                selected={this.state.active === 0}
                onChange={v => this.onChange(v)}
              >
                Активна речовина
              </RadioInput>
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="1/4">
              <Field
                type="number"
                name="one.ingredients.numerator_value"
                labelText="Кількість"
                component={FieldInput}
                placeholder="0-1000"
              />
            </FormColumn>
            <FormColumn size="1/3">
              <Field
                name="one.ingredients.numerator_unit"
                labelText="Одиниці"
                component={SelectUniversal}
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
                name="one.ingredients.denumerator_unit"
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
          <Line />
          <FormRow>
            <FieldArray
              name="ingredients"
              component={RenderIngredient}
              data={data}
              onSearchInnms={onSearchInnms}
              onChange={this.onChange}
              onSearchChange={this.onSearchChange}
              active={this.state.active}
            />
          </FormRow>
          {!disabled && (
            <ShowWithScope scope="innm_dosage:write">
              <div>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Додаємо..." : "Додати лікарську форму"}
                </Button>
              </div>
            </ShowWithScope>
          )}
        </div>
      </form>
    );
  }
}

export default compose(
  reduxForm({
    form: "inns-dosages-create-form",
    validate: reduxFormValidate({
      name: {
        required: true
      },
      form: {
        required: true
      },
      "one.is_primary": {
        required: false
      },
      "one.ingredients.denumerator_value": {
        required: true
      },
      "one.ingredients.numerator_value": {
        required: true
      },
      "one.ingredients.numerator_unit": {
        required: true
      },
      "one.ingredients.denumerator_unit": {
        required: true
      },
      ingredients: collectionOf({
        id: {
          required: true
        },
        denumerator_value: {
          required: true
        },
        numerator_value: {
          required: true
        },
        numerator_unit: {
          required: true
        },
        denumerator_unit: {
          required: true
        }
      })
    }),
    initialValues: {
      one: {
        is_primary: true
      }
    },
    enableReinitialize: false
  }),
  connect(state => ({
    values: getFormValues("inns-dosages-create-form")(state)
  }))
)(InnmDosagesCreateForm);
