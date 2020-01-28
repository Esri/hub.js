import { getTypes, getProp } from "@esri/hub-common";

export function collectionFilter(queryFilters: any) {
  const categories = getProp(queryFilters, "collection.terms") || [];
  const typesArr = categories.map((c: string) => getTypes(c));
  // flatten typesArr
  const filter = typesArr
    .filter((types: string[]) => !!types)
    .reduce((singleArr: string[], types: string[]) => {
      types.forEach(type => {
        singleArr.push(`type:"${type}"`);
      });
      return singleArr;
    }, [])
    .join(" OR ");
  return `(${filter})`;
}
