import { getProp } from "@esri/hub-common";
const apiTypes = ["Feature Service", "Map Service", "Image Service"];

export function hasApi(queryFilters: any) {
  const hasApiTrue = (getProp(queryFilters, "hasApi.terms") || [])[0];
  let apiFilter;
  if (hasApiTrue) {
    apiFilter = apiTypes
      .map(type => {
        return `type:"${type}"`;
      })
      .join(" OR ");
  } else {
    apiFilter = apiTypes
      .map(type => {
        return `-type:"${type}"`;
      })
      .join(" OR ");
  }
  return `(${apiFilter})`;
}
