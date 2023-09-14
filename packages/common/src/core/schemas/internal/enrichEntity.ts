import { IGroup } from "@esri/arcgis-rest-types";
import { HubEntity } from "../../types";
import { IHubRequestOptions } from "../../../types";
import { mapBy } from "../../../utils";
import { getProp, setProp } from "../../../objects";
import { getGroup } from "@esri/arcgis-rest-portal";
import { parseInclude } from "../../../search/_internal/parseInclude";
import { unique } from "../../../util";

type EntityEditorEnrichment = keyof IEntityEditorEnrichments;
interface IEntityEditorEnrichments {
  followersGroup?: IGroup;
}

/**
 * Function to enrich an entity. This is used within
 * the toEditor functionlity to enrich an entity with
 * additional information that the editor may need.
 *
 * @param entity Hub entity
 * @param include Array of enrichment strings
 * @param requestOptions Hub request options
 */
export const enrichEntity = async (
  entity: HubEntity,
  include: string[],
  requestOptions: IHubRequestOptions
): Promise<HubEntity & IEntityEditorEnrichments> => {
  const specs = include.map(parseInclude);
  const enrichments = mapBy("enrichment", specs).filter(unique);

  // delegate to fetch enrichments if any have been defined
  let enrichmentResults: IEntityEditorEnrichments = {};
  if (enrichments.length) {
    enrichmentResults = await fetchEnrichments(
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
const fetchEnrichments = async (
  entity: HubEntity,
  enrichments: EntityEditorEnrichment[],
  requestOptions?: IHubRequestOptions
): Promise<IEntityEditorEnrichments> => {
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
  const followersGroupId = getProp(entity, "followersGroupId");
  return getGroup(followersGroupId, requestOptions);
};
