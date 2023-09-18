import { IGroup } from "@esri/arcgis-rest-types";
import { HubEntity } from "./types";
import { IHubRequestOptions } from "../types";
import { mapBy } from "../utils";
import { getProp, setProp } from "../objects";
import { getGroup } from "@esri/arcgis-rest-portal";
import { parseInclude } from "../search/_internal/parseInclude";
import { unique } from "../util";

type EntityEnrichment = keyof IEntityEnrichments;
interface IEntityEnrichments {
  followersGroup?: IGroup;
}

/**
 * Function to enrich an entity with information that
 * requires an additional XHR
 *
 * @param entity Hub entity
 * @param include Array of enrichment strings
 * @param requestOptions Hub request options
 */
export const enrichEntity = async (
  entity: HubEntity,
  include: string[],
  requestOptions: IHubRequestOptions
): Promise<HubEntity & IEntityEnrichments> => {
  const specs = include.map(parseInclude);
  const enrichments = mapBy("enrichment", specs).filter(unique);

  // delegate to fetch enrichments if any have been defined
  let enrichmentResults: IEntityEnrichments = {};
  if (enrichments.length) {
    enrichmentResults = await fetchEntityEnrichments(
      entity,
      enrichments,
      requestOptions
    );
  }

  // add the enrichments back to the entity based on the enrichment spec
  specs.forEach((spec) => {
    setProp(spec.prop, getProp(enrichmentResults, spec.path), entity);
  });

  return entity;
};

/**
 * This function delegates out to other helper functions
 * to fetch the entity enrichments.
 */
const fetchEntityEnrichments = async (
  entity: HubEntity,
  enrichments: EntityEnrichment[],
  requestOptions?: IHubRequestOptions
): Promise<IEntityEnrichments> => {
  // Note: we chose to keep this simple for now and not create
  // an operation pipeline - if this becomes more widely used
  // or we run into issues debugging, we can implement
  const operations = enrichments.reduce((ops, enrichment) => {
    const operation = {
      followersGroup: fetchFollowersGroupEnrichment,
    }[enrichment];

    operation && ops.push({ enrichment, operation });
    return ops;
  }, []);

  const enrichmentFns = operations.map(({ operation }) =>
    operation(entity, requestOptions)
  );
  const enrichmentResults = await Promise.all(enrichmentFns);
  return enrichmentResults.reduce((acc, result, idx) => {
    acc[operations[idx].enrichment] = result;
    return acc;
  }, {});
};

/**
 * fetch the entity's followers group
 */
const fetchFollowersGroupEnrichment = async (
  entity: HubEntity,
  requestOptions: IHubRequestOptions
): Promise<IGroup> => {
  let group = {} as IGroup;
  try {
    const followersGroupId = getProp(entity, "followersGroupId");
    if (followersGroupId) {
      group = await getGroup(followersGroupId, requestOptions);
    }
  } catch (error) {
    return {} as IGroup;
  }

  return group;
};
