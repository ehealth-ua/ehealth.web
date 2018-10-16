import Url from "url";
import qs from "qs";

export const createUrl = (endpoint, options) => {
  const url = Url.parse(endpoint, false);

  url.search = qs.stringify({
    ...qs.parse(url.search),
    ...options
  });
  return Url.format(url);
};

export const stripProtocol = url => {
  return url && url.replace(/(^\w+:|^)\/\//, "");
};

export const backUrl = router => {
  const { location } = router;
  const index = location["pathname"].indexOf("/", 1);
  return `/${location["pathname"].slice(1, index)}`;
};
