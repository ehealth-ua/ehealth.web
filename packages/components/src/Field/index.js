import Field from "./Field";
import {
  InputField,
  TextField,
  MultilineTextField,
  NumberField,
  PasswordField
} from "./InputField";
import SelectField from "./SelectField";
import FileField from "./FileField";
import { CheckboxField, RadioField } from "./CheckableField";
import GroupField from "./GroupField";
import ArrayField from "./ArrayField";
import { Row, Col } from "./Grid";

Field.Input = InputField;
Field.Text = TextField;
Field.MultilineText = MultilineTextField;
Field.Number = NumberField;
Field.Password = PasswordField;
Field.Select = SelectField;
Field.File = FileField;
Field.Checkbox = CheckboxField;
Field.Radio = RadioField;
Field.Group = GroupField;
Field.Array = ArrayField;
Field.Row = Row;
Field.Col = Col;

export default Field;
