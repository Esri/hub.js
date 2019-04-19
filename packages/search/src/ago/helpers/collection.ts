import { hubTypeExpansion } from "../hub-type-map";

export function collection(queryFilters: any) {
  const categories =
    queryFilters && queryFilters.collection && queryFilters.collection.terms
      ? queryFilters.collection.terms
      : [];
  const types = categories.flatMap((c: any) => hubTypeExpansion(c) || []);
  const filter = types.map((type: string) => `type:"${type}"`).join(" OR ");
  return `(${filter})`;
}
