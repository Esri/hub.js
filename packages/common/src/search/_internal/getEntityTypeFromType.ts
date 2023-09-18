import { EntityType } from "../types";

/**
 * @private
 * Given a type (e.g. Hub Site Application) return the appropriate entity type
 * that can be used as a `targetEntity` in an `IQuery`
 * @param type
 * @returns
 */
export function getEntityTypeFromType(type: string): EntityType {
  // Default to item, as it's the most common
  let etype: EntityType = "item";

  // Some are just downcased, so we can check them with an array
  if (["group", "event", "user", "channel"].includes(type.toLowerCase())) {
    etype = type.toLocaleLowerCase() as EntityType;
  }

  // Group Member is just weird
  if (type.toLowerCase() === "group member") {
    etype = "groupMember";
  }

  return etype;
}
