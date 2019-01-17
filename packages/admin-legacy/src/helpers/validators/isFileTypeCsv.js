const isFileTypeCsv = value =>
  value && value.type !== "text/csv" ? false : true;

export default isFileTypeCsv;
