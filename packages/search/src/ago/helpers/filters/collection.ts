import { getTypes } from "@esri/hub-common";

export function collection(queryFilters: any) {
  const categories =
    queryFilters && queryFilters.collection && queryFilters.collection.terms
      ? queryFilters.collection.terms
      : [];
  const types = categories.flatMap((c: any) => getTypes(c) || []);
  const filter = types.map((type: string) => `type:"${type}"`).join(" OR ");
  return `(${filter})`;
}
