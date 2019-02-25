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

import FieldInput from "../../../components/reduxForm/FieldInput";
import FieldDate from "../../../components/reduxForm/FieldDatepicker";

import { SelectUniversal } from "../../../components/SelectUniversal";
import RadioInput from "../../../components/RadioInput";
import { FormRow, FormColumn } from "../../../components/Form";
import Button from "../../../components/Button";
import Line from "../../../components/Line";

import RenderIngredient from "./renderIngredient";
import RenderCodeAtc from "./renderCodeAtc";

import styles from "./styles.module.css";

class MedicationsCreateForm extends React.Component {
  constructor() {
    super();
    this.state = {
      innms_search: "",
      country_search: "",
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
      onSearchInnmsDosages = () => {},
      submitting,
      disabled = false,
      data,
      values = {}
    } = this.props;
    const container__active =
      values.container &&
      values.container.denumerator_unit &&
      `${values.container.denumerator_unit.title.slice(0, 3)}.`;

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
              placeholder="Введіть торгівельне найменування"
            />
          </FormRow>
          <FormRow>
            <Field
              name="defaultCodeAtc"
              labelText="Код АТХ"
              component={FieldInput}
              disabled={disabled}
              placeholder="Введіть код АТХ"
            />
            <FieldArray name="code_atc" component={RenderCodeAtc} />
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
              >
                <ErrorMessage when="required">
                  Обов&#700;язкове поле
                </ErrorMessage>
              </Field>
            </FormColumn>
          </FormRow>
          <FormRow>
            <Field
              name="daily_dosage"
              labelText="Добова доза"
              type="number"
              component={FieldInput}
              disabled={disabled}
            />
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
                  onSearchInnmsDosages(v).then(() =>
                    this.setState({
                      innms_search: v.toLowerCase()
                    })
                  )
                }
                options={data.innm_dosages
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
              onSearchInnmsDosages={onSearchInnmsDosages}
              onSearchChange={this.onSearchChange}
              data={data}
              onChange={this.onChange}
              active={this.state.active}
            />
          </FormRow>
          <div className={styles.title}>&#8546;. Упаковка</div>
          <div className={styles.title}>
            <b>Контейнер</b>
          </div>
          <FormRow>
            <FormColumn size="1/4">
              <Field
                name="container.denumerator_unit"
                labelText="Тип"
                placeholder="Упаковка"
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
                name="container.numerator_value"
                type="number"
                component={FieldInput}
                labelText="Кількість"
                placeholder="30"
              >
                <ErrorMessage when="required">
                  Обов&#700;язкове поле
                </ErrorMessage>
              </Field>
            </FormColumn>
            <FormColumn size="1/3" align="bottom">
              <Field
                name="container.numerator_unit"
                component={SelectUniversal}
                placeholder="Таблетки"
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
            <FormColumn size="2/5">
              <Field
                name="package_qty"
                component={FieldInput}
                type="number"
                labelText="Упаковка кількість"
                postfix={container__active}
              >
                <ErrorMessage when="required">
                  Обов&#700;язкове поле
                </ErrorMessage>
              </Field>
            </FormColumn>
            <FormColumn size="4/5">
              <Field
                name="package_min_qty"
                component={FieldInput}
                type="number"
                labelText="Упаковка мінімальна кількість"
                postfix={container__active}
              >
                <ErrorMessage when="required">
                  Обов&#700;язкове поле
                </ErrorMessage>
              </Field>
              <FormColumn />
            </FormColumn>
            <FormColumn size="1/2" />
          </FormRow>
          <div className={styles.title}>&#8547;. Країна виробник</div>
          <FormRow>
            <Field
              name="manufacturer.country"
              component={SelectUniversal}
              labelText="Країна"
              emptyText="Не знайдено"
              placeholder="Почніть вводити назву"
              searchable
              onChangeSearch={val =>
                this.setState({ country_search: val.toLowerCase() })
              }
              options={Object.keys(data.countries.values)
                .filter(
                  key =>
                    new RegExp(this.state.country_search).test(
                      data.countries.values[key].toLowerCase()
                    ) === true
                )
                .map(key => ({
                  name: key,
                  title: data.countries.values[key]
                }))}
            >
              <ErrorMessage when="required">Обов&#700;язкове поле</ErrorMessage>
            </Field>
          </FormRow>
          <FormRow>
            <Field
              name="manufacturer.name"
              component={FieldInput}
              labelText="Виробник"
              placeholder="Введіть виробника"
            >
              <ErrorMessage when="required">Обов&#700;язкове поле</ErrorMessage>
            </Field>
          </FormRow>
          <div className={styles.title}>&#8548;. Реєстраційне посвідчення</div>
          <FormRow>
            <FormColumn size="2/5" align="baseline">
              <Field
                name="certificate"
                component={FieldInput}
                labelText="Номер реєстраційного посвідчення"
                placeholder="Номер реєстраційного посвідчення"
              >
                <ErrorMessage when="required">
                  Обов&#700;язкове поле
                </ErrorMessage>
              </Field>
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <Field
                name="certificate_expired_at"
                component={FieldDate}
                dateFormat="YYYY-MM-DD"
                labelText="Дата закінчення реєстраційного посвідчення"
                placeholder="2018-02-01"
              />
            </FormColumn>
          </FormRow>
          {!disabled && (
            <ShowWithScope scope="medication:write">
              <div>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Додаємо..."
                    : "Додати торгівельне найменування"}
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
    form: "medications-create-form",
    validate: reduxFormValidate({
      name: {
        required: true
      },
      defaultCodeAtc: {
        required: true
      },
      daily_dosage: {
        required: true
      },
      form: {
        required: true
      },
      "manufacturer.name": {
        required: true
      },
      "manufacturer.country": {
        required: true
      },
      "one.is_primary": {
        required: false
      },
      "one.ingredients.id": {
        required: true
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
      }),
      "container.numerator_unit": {
        required: true
      },
      "container.numerator_value": {
        required: true
      },
      "container.denumerator_unit": {
        required: true
      },
      package_qty: {
        required: false
      },
      package_min_qty: {
        required: false
      },
      certificate: {
        required: false
      },
      certificate_expired_at: {
        required: false
      }
    }),
    initialValues: {
      one: {
        is_primary: true
      }
    },
    enableReinitialize: false
  }),
  connect(state => ({
    values: getFormValues("medications-create-form")(state)
  }))
)(MedicationsCreateForm);
