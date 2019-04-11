// builds the groupIds filter
export function groupIds(queryFilters: any) {
  const groups =
    queryFilters && queryFilters.groupIds && queryFilters.groupIds.terms
      ? queryFilters.groupIds.terms
      : [];
  const groupsFilter = groups
    .map((id: string) => {
      return `group:"${id}"`;
    })
    .join(" OR ");
  return `(${groupsFilter})`;
}
