import { getProp } from "@esri/hub-common";

// builds the groupIds filter
export function groupIds(queryFilters: any) {
  const groups = getProp(queryFilters, "groupIds.terms") || [];
  const groupsFilter = groups
    .map((id: string) => {
      return `group:"${id}"`;
    })
    .join(" OR ");
  return `(${groupsFilter})`;
}
