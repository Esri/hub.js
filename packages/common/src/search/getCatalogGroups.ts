import { IArcGISContext } from "../ArcGISContext";
import { unique } from "../util";
import { Catalog } from "./Catalog";
import { IGroupsByMembership } from "./types/IGroupsByMembership";
import { getUserGroupsFromQuery } from "./getUserGroupsFromQuery";
import { IHubCatalog, IQuery } from "./types/IHubCatalog";

/**
 * Return an IGroupsByMembership object that contains all the groups, from all the
 * collections/scopes in the catalog, which the current user is an owner/member/admin of.
 * @param catalog
 * @param context
 * @returns
 */
export function getCatalogGroups(
  catalog: IHubCatalog,
  context: IArcGISContext
): IGroupsByMembership {
  // create the response object
  const response: IGroupsByMembership = {
    owner: [],
    member: [],
    admin: [],
  };
  // create the catalog
  const instance = Catalog.fromJson(catalog, context);
  const collectionUserGroups = instance.collectionNames.map((name) => {
    // important that we use .getCollection as that merges in the scope from the catalog
    const collection = instance.getCollection(name);
    return getUserGroupsFromQuery(collection.scope, context.currentUser);
  });

  // get the scopes that do not have related collections
  const nakedScopeTargetEntities = Object.keys(catalog.scopes).reduce(
    (acc, key) => {
      // check if there are colletions with this targetEntity
      const hasCollection = (catalog.collections || []).some(
        (collection) => collection.targetEntity === key
      );
      // if not, add it to the list
      if (!hasCollection) {
        acc.push(key);
      }
      return acc;
    },
    []
  );

  const scopeUserGroups = nakedScopeTargetEntities.map((targetEntity) => {
    const scopeQuery = instance.getScope(targetEntity) as IQuery;
    return getUserGroupsFromQuery(scopeQuery, context.currentUser);
  });

  // Merge the naked scopes into the response
  [...scopeUserGroups, ...collectionUserGroups].forEach((groups) => {
    response.owner = [...response.owner, ...groups.owner];
    response.member = [...response.member, ...groups.member];
    response.admin = [...response.admin, ...groups.admin];
  });
  // ensure only unique entries in each array
  response.owner = response.owner.filter(unique);
  response.member = response.member.filter(unique);
  response.admin = response.admin.filter(unique);

  return response;
}
