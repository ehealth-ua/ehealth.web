export default function(
  data,
  name,
  status = "status",
  nameCheckInArr = "name"
) {
  const arrWithStatus = data.reduce(
    (prev, item) => (!item[status] ? prev : [...prev, item]),
    []
  );
  const lastFromArray = arrWithStatus.length > 1;
  const nameCheck = !lastFromArray && arrWithStatus[0][nameCheckInArr];
  return lastFromArray || nameCheck !== name;
}
