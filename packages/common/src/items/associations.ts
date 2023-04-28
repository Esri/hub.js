import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem, ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";
import {
  AssociationType,
  IAssociationInfo,
  IEntityInfo,
  IHubInitiative,
  IHubItemEntity,
  IHubProject,
} from "../core";
import { fetchAllPages } from "./fetch-all-pages";

/**
 * Add an association to an entity
 * @param info
 * @param entity
 */
export function addAssociation(
  info: IAssociationInfo,
  entity: IHubItemEntity
): void {
  if (!entity.typeKeywords) {
    entity.typeKeywords = [];
  }
  const association = `${info.type}|${info.id}`;
  if (!entity.typeKeywords.includes(association)) {
    entity.typeKeywords.push(association);
  }
}

/**
 * Remove an association from an entity
 * @param info
 * @param entity
 * @returns
 */
export function removeAssociation(
  info: IAssociationInfo,
  entity: IHubItemEntity
): void {
  if (!entity.typeKeywords) {
    return;
  }
  const association = `${info.type}|${info.id}`;
  const index = entity.typeKeywords.indexOf(association);
  if (index > -1) {
    entity.typeKeywords.splice(index, 1);
  }
}

/**
 * Return a list of all associations on an entity
 * Currently only "initiative" associations are supported
 * @param entity
 * @returns
 */
export function listAssociations(
  entity: IHubItemEntity,
  type: AssociationType
): IAssociationInfo[] {
  if (!entity.typeKeywords) {
    return [];
  }
  return entity.typeKeywords
    .filter((tk) => tk.indexOf(`${type}|`) > -1)
    .map((tk) => {
      const [t, id] = tk.split("|");
      return { type: t, id } as IAssociationInfo;
    });
}

/**
 * Fetch the Initiatives that a Project has been associated
 * Extracts id's from the `initiative|<initiative-id>` typekeywords
 * and issues a search for those items. System will only return items
 * the current user has access to, regardless of the access level of the Project
 * @param entity
 * @param type
 * @param requestOptions
 * @returns
 */
export function fetchAssociatedInitiatives(
  project: IHubProject,
  requestOptions: IRequestOptions
): Promise<IEntityInfo[]> {
  const type: AssociationType = "initiative";
  const associations = listAssociations(project, "initiative").filter(
    (a) => a.type === type
  );
  if (associations.length === 0) {
    return Promise.resolve([]);
  }
  // construct query usign the ids from the associations
  const query = associations.map((a) => `id:${a.id}`).join(" OR ");
  return searchItemsAsEntityInfo(query, requestOptions);
}

/**
 * Fetch the Projects that are associated with an Initiative
 * Executes a query for Hub Projects that have typekeywords of "initiative|<initiative-id>"
 * System will only return Projects the current user has access to, regardless of the access level of the Initiative
 * @param initiative
 * @param requestOptions
 * @returns
 */
export function fetchAssociatedProjects(
  initiative: IHubInitiative,
  requestOptions: IRequestOptions
): Promise<IEntityInfo[]> {
  const query = `type:Hub Project AND typekeywords:initiative|${initiative.id}`;
  return searchItemsAsEntityInfo(query, requestOptions);
}

function searchItemsAsEntityInfo(q: string, requestOptions: IRequestOptions) {
  const opts: ISearchOptions = {
    q,
    num: 100,
    ...requestOptions,
  };
  // in some extreme cases, we may need to fetch more than 100 items
  return fetchAllPages(searchItems, opts, -1, 100).then((response) => {
    // return the results
    const typedResponse = response as IItem[];
    return typedResponse.map((r) => {
      return {
        id: r.id,
        name: r.title,
        type: r.type,
      } as IEntityInfo;
    });
  });
}
