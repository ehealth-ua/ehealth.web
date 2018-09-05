export default function(array, headerName) {
  const filterArray = array.filter(({ name }) => headerName === name);
  const [{ status } = {}] = filterArray;
  return status;
}
