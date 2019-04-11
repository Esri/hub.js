import { IQueryObject } from "../create-q";

export function calcStart(queryObject: IQueryObject) {
  const defaultPageObject: { [key: string]: number } = {};
  const pageObject = queryObject.page || defaultPageObject;
  const page = pageObject.number || 1;
  const size = pageObject.size || 10;
  return 1 + (page - 1) * size;
}
