import { updateGroup } from "@esri/arcgis-rest-portal";
import { getProp } from "../objects/get-prop";
import { setProp } from "../objects/set-prop";
import { IArcGISContext } from "../ArcGISContext";
import { SettableAccessLevel } from "../core/types/types";
import { IQuery } from "../search/types/IHubCatalog";
import { getGroupPredicate } from "../search/utils";
import { IWithAssociations } from "../core/traits/IWithAssociations";

/**
 * Sets the access level of the association group
 * @access access level to set
 */
export async function setAssociationsGroupAccess(
  groupId: string,
  access: SettableAccessLevel,
  context: IArcGISContext
): Promise<void> {
  await updateGroup({
    group: {
      id: groupId,
      access,
    },
    authentication: context.hubRequestOptions.authentication,
  });
}

/**
 * Sets the membership access level of the association group
 * @param membershipAccess membership access level to set
 */
export async function setAssociationsMembershipAccess(
  groupId: string,
  membershipAccess: "organization" | "collaborators" | "anyone",
  context: IArcGISContext
): Promise<void> {
  await updateGroup({
    group: {
      id: groupId,
      membershipAccess,
    },
    authentication: context.hubRequestOptions.authentication,
  });
}

/**
 * Adds or removes the association group from the entity catalog
 * @param includeInCatalog
 */
export function setAssociationsIncludeInCatalog(
  entity: IWithAssociations,
  includeInCatalog: boolean
): IWithAssociations {
  // Handle entities that don't have a catalog scope defined
  if (!getProp(entity, "catalog.scopes.item")) {
    setProp(
      "catalog.scopes.item",
      { targetEntity: "item", filters: [] } as IQuery,
      entity
    );
  }

  // current group ids in the predicate
  let groupIds: string[] = [];

  // get the current group predicate
  const groupPredicate = getGroupPredicate(entity.catalog.scopes.item);
  if (groupPredicate) {
    const { group: groupClause } = groupPredicate;
    groupIds = Array.isArray(groupClause) ? groupClause : [groupClause];
  }

  // update the group ids list based on the includeInCatalog flag and whether
  // the group is already in the list
  if (includeInCatalog && !groupIds.includes(entity.associations.groupId)) {
    groupIds.push(entity.associations.groupId);
  } else if (
    !includeInCatalog &&
    groupIds.includes(entity.associations.groupId)
  ) {
    groupIds.splice(groupIds.indexOf(entity.associations.groupId), 1);
  }

  // if we already have a group predicate, update the group clause
  if (groupPredicate) {
    groupPredicate.group = groupIds;
  }
  // else there is no group predicate, so create it
  else {
    entity.catalog.scopes.item.filters.push({
      operation: "OR",
      predicates: [
        {
          group: groupIds,
        },
      ],
    });
  }

  return entity;
}
