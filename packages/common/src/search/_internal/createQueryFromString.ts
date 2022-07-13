import { EntityType, IPredicate, IQuery } from "../types";

/**
 * @private
 * Construct a query from a string
 * @param value
 * @param predicateKey
 * @param targetEntity
 * @returns
 */
export function createQueryFromString(
  value: string,
  predicateKey: string,
  targetEntity: EntityType
): IQuery {
  const predicate: IPredicate = {};
  predicate[predicateKey] = value;
  const qry: IQuery = {
    targetEntity,
    filters: [
      {
        predicates: [predicate],
      },
    ],
  };
  return qry;
}
