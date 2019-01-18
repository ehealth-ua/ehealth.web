const WHITE_LIST = [
  "text/plain",
  "text/x-csv",
  "application/vnd.ms-excel",
  "text/x-csv",
  "application/x-csv",
  "text/csv",
  "text/comma-separated-values",
  "text/x-comma-separated-values",
  "text/tab-separated-values"
];

const isFileTypeCsv = value => value && WHITE_LIST.includes(value.type);

export default isFileTypeCsv;
