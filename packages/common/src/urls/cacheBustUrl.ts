/**
 * artifically update a query param associated with a url to force
 * the browser to load it from file rather than from cache
 */
export const cacheBustUrl = (url: string, param = "v"): string => {
  if (!url) {
    return url;
  }

  const delimiter = url.indexOf("?") > -1 ? "&" : "?";
  url += `${delimiter}${param}=${new Date().getTime()}`;

  return url;
};
