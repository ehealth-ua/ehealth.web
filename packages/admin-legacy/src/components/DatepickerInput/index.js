import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "moment/locale/uk";

import "./react-datepicker-cssmodules.css";

import Input from "../Input";

const Component = ({
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
    locale="uk"
    maxDate={maxDate}
    onChange={params => params && onChange(params.format(dateModelFormat))}
    onBlur={() => onBlur(value)}
    selected={value ? moment(value, dateModelFormat) : null}
    shouldCloseOnSelect={true}
    placeholderText={placeholder}
    {...rest}
  />
);

const ComponentInput = ({ dateFormat, ...rest }) => (
  <Input component={Component} {...rest} dateFormat={dateFormat} />
);

export default ComponentInput;
