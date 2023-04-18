import { IHubInitiative } from "../core/types/IHubInitiative";
import { IHubProject } from "../core/types/IHubProject";
import { IMetric, IEntityInfo, MetricSource } from "../core/types/Metrics";
import { getProp } from "../objects/get-prop";
import { cloneObject } from "../util";

/**
 * Get the metrics from an entity applying some pre-processing
 * and adding source info.
 * @param entity
 * @returns
 */
export function getEntityMetrics(
  entity: IHubProject | IHubInitiative
): IMetric[] {
  // Create the source info that will attach into each metric
  const sourceInfo: IEntityInfo = {
    id: entity.id,
    name: entity.name,
    type: entity.type,
  };

  const entityMetrics = entity.metrics || [];

  const metrics = entityMetrics.map((metric) => {
    // assign the source info to the metric
    metric.entityInfo = { ...sourceInfo };

    // at this point the source references should have been resolved
    // so we can cast the source to a MetricSource
    const source = metric.source as MetricSource;
    // If the metric is an item query and the catalog key is defined
    // get the scope from the specified collection in the catalog.
    if (source.type === "item-query" && source.collectionKey) {
      const key = source.collectionKey;
      const query = getProp(
        entity.catalog,
        `collections[findBy(key,'${key}')].scope`
      );

      if (query) {
        source.scope = cloneObject(query);
      }
    }
    // reassign the source with updates
    metric.source = source;
    return metric;
  });

  return metrics;
}
