import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

import "./react-datepicker-cssmodules.css";

import Input from "../Input";

export const Component = ({
  input,
  onBlur,
  maxDate,
  onChange,
  value,
  dateModelFormat = "YYYY-MM-DD",
  placeholder,
  ...rest
}) => (
  <DatePicker
    {...input}
    locale="uk-UA"
    maxDate={maxDate}
    onChange={params => params && onChange(params.format(dateModelFormat))}
    onBlur={() => onBlur(value)}
    selected={value ? moment(value, dateModelFormat) : null}
    shouldCloseOnSelect={true}
    placeholderText={placeholder}
    {...rest}
  />
);

export const ComponentInput = ({ dateFormat, ...rest }) => (
  <Input component={Component} {...rest} dateFormat={dateFormat} />
);

export default ComponentInput;
