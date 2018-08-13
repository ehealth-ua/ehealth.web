import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { reduxForm, Field, FieldArray, getFormValues } from "redux-form";
import {
  collectionOf,
  reduxFormValidate,
  ErrorMessages,
  ErrorMessage,
  arrayOf
} from "react-nebo15-validate";

import Form, {
  FormRow,
  FormBlock,
  FormButtons,
  FormColumn,
  FormError
} from "../../../components/Form";
import FieldCheckbox from "../../../components/reduxForm/FieldCheckbox";
import FieldInput from "../../../components/reduxForm/FieldInput";
import Button, { ButtonsGroup } from "../../../components/Button";
import ShowWithScope from "../../blocks/ShowWithScope";

const getValues = getFormValues("dictionary-form");

class DictionaryForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      savedValues: props.initialValues
    };
  }
  onSubmit(values, ...args) {
    if (typeof this.props.onSubmit !== "function") {
      this.setState({
        savedValues: values
      });
      return true;
    }
    const submitRes = this.props.onSubmit(values, ...args);
    if (typeof submitRes !== "function") {
      this.setState({
        savedValues: values
      });
      return submitRes;
    }

    submitRes.then(() => {
      this.setState({
        savedValues: values
      });
    });

    return submitRes;
  }
  get isChanged() {
    const { values = [] } = this.props;
    return JSON.stringify(values) !== JSON.stringify(this.state.savedValues);
  }
  render() {
    const { handleSubmit, readOnly, submitting } = this.props;

    return (
      <Form onSubmit={handleSubmit(this.onSubmit)}>
        <FormBlock title="Загальне">
          <FormRow>
            <Field
              name="is_active"
              labelText="Активний"
              component={FieldCheckbox}
              disabled={readOnly}
            />
          </FormRow>
        </FormBlock>
        <FieldArray
          name="values"
          component={renderFields}
          readOnly={readOnly}
        />
        <FieldArray name="labels" component={labelFields} readOnly={readOnly} />
        <FormButtons>
          <ShowWithScope scope="dictionary:write">
            <ButtonsGroup>
              <Button type="submit" disabled={!this.isChanged}>
                {submitting
                  ? "Збереження..."
                  : this.isChanged ? "Зберегти словник" : "Збережено"}
              </Button>
            </ButtonsGroup>
          </ShowWithScope>
        </FormButtons>
      </Form>
    );
  }
}

export default compose(
  reduxForm({
    form: "dictionary-form",
    validate: reduxFormValidate({
      values: collectionOf(
        {
          key: {
            required: true
          },
          value: {
            required: true
          }
        },
        {
          required: true,
          minLength: 1,
          uniqueKey: "key"
        }
      )
    }),
    labels: arrayOf(
      {
        required: true
      },
      {
        unique: true
      }
    )
  }),
  connect(state => ({
    values: getValues(state)
  }))
)(DictionaryForm);

const labelFields = ({ fields, readOnly }) => (
  <FormBlock title="Мітки">
    {fields.map((item, index) => (
      <FormRow key={index}>
        <FormColumn>
          <Field
            name={item}
            labelText={index === 0 && "Назва"}
            component={FieldInput}
            placeholder="Назва тегу"
            readOnly={readOnly}
          />
        </FormColumn>
        <ShowWithScope scope="dictionary:write">
          {!readOnly && (
            <FormColumn align="bottom">
              <Button
                color="red"
                type="button"
                size="small"
                onClick={() => fields.remove(index)}
                tabIndex={-1}
              >
                Видалити
              </Button>
            </FormColumn>
          )}
        </ShowWithScope>
      </FormRow>
    ))}
    <ShowWithScope scope="dictionary:write">
      {!readOnly && (
        <FormButtons>
          <Button
            type="button"
            color="blue"
            size="small"
            onClick={() => fields.push()}
          >
            Додати
          </Button>
        </FormButtons>
      )}
    </ShowWithScope>
  </FormBlock>
);

const renderFields = ({ fields, readOnly, meta }) => (
  <FormBlock title="Значення">
    {fields.map((item, index) => (
      <FormRow key={index}>
        <FormColumn>
          <Field
            name={`${item}.key`}
            labelText={index === 0 && "Ключ"}
            component={FieldInput}
            placeholder="Ключ елемента"
            readOnly={readOnly}
          />
        </FormColumn>
        <FormColumn>
          <Field
            name={`${item}.value`}
            labelText={index === 0 && "Опис"}
            component={FieldInput}
            placeholder="Опис елемента"
            readOnly={readOnly}
          />
        </FormColumn>
        <ShowWithScope scope="dictionary:write">
          {!readOnly && (
            <FormColumn align="bottom">
              <Button
                color="red"
                type="button"
                size="small"
                onClick={() => fields.remove(index)}
                tabIndex={-1}
              >
                Видалити
              </Button>
            </FormColumn>
          )}
        </ShowWithScope>
      </FormRow>
    ))}
    <ShowWithScope scope="dictionary:write">
      {!readOnly && (
        <FormButtons>
          <Button
            type="button"
            color="blue"
            size="small"
            onClick={() => fields.push({})}
          >
            Додати
          </Button>
        </FormButtons>
      )}
    </ShowWithScope>
    {meta.error && (
      <FormError>
        <ErrorMessages error={meta.error}>
          <ErrorMessage when="uniqueKey">
            {`Не унікальні значення в ключі: ${meta.error.uniqueKey}`}
          </ErrorMessage>
        </ErrorMessages>
      </FormError>
    )}
  </FormBlock>
);
