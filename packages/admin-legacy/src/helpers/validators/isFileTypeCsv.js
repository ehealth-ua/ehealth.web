const WHITE_LIST = [
  "text/plain",
  "text/x-csv",
  "application/vnd.ms-excel",
  "text/x-csv",
  "application/x-csv",
  "text/csv",
  "text/comma-separated-values",
  "text/x-comma-separated-values",
  "text/tab-separated-values",
  // Uncommon file extensions would return an empty string.
  // Client configuration (for instance, the Windows Registry)
  // may result in unexpected values even for common types.
  ""
];

const isFileTypeCsv = value => value && WHITE_LIST.includes(value.type);

export default isFileTypeCsv;
