import Field, { ListenerChange } from "./Field";
import {
  InputField,
  TextField,
  MultilineTextField,
  NumberField,
  PasswordField,
  MaskField,
  LabelInInputField
} from "./InputField";
import SelectField from "./SelectField";
import FileField from "./FileField";
import { CheckboxField, RadioField } from "./CheckableField";
import GroupField from "./GroupField";
import ArrayField from "./ArrayField";
import { Row, Col } from "./Grid";

Field.Input = InputField;
Field.MaskField = MaskField;
Field.LabelInInputField = LabelInInputField;
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
Field.ListenerChange = ListenerChange;

export default Field;
