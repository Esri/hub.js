import { getProp, categories } from "@esri/hub-common";

export function hasApiFilter(queryFilters: any) {
  const hasApiTrue = (getProp(queryFilters, "hasApi.terms") || [])[0];
  let apiFilter;
  if (hasApiTrue) {
    apiFilter = categories.apiTypes
      .map((type: string) => {
        return `type:"${type}"`;
      })
      .join(" OR ");
  } else {
    apiFilter = categories.apiTypes
      .map((type: string) => {
        return `-type:"${type}"`;
      })
      .join(" OR ");
  }
  return `(${apiFilter})`;
}
