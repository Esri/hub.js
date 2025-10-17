import { IRequestOptions } from "@esri/arcgis-rest-request";
import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IModel } from "../../hub-types";
import { processEntityFeatures } from "../../permissions/_internal/processEntityFeatures";
import { ProjectDefaultFeatures } from "./ProjectBusinessRules";
import { computeLinks } from "./computeLinks";
import { computeItemProps } from "../../core/_internal/computeItemProps";
import { applyProjectMigrations } from "./applyProjectMigrations";
import { IHubProject } from "../../core/types/IHubProject";
import { getItemThumbnailUrl } from "../../resources/get-item-thumbnail-url";
import { upgradeCatalogSchema } from "../../search/upgradeCatalogSchema";
import { ArcGISContextManager } from "../../ArcGISContextManager";
import { MetricVisibility } from "../../core/types/Metrics";
import { getAssociatedEntitiesQuery } from "../../associations/getAssociatedEntitiesQuery";

/**
 * Given a model and a project, set various computed properties that can't be directly mapped
 * @private
 * @param model
 * @param project
 * @param requestOptions
 * @returns
 */
export async function computeProps(
  model: IModel,
  project: Partial<IHubProject>,
  requestOptions: IRequestOptions
): Promise<IHubProject> {
  const contextMngr = await ArcGISContextManager.create({
    portalUrl: requestOptions.portal,
    authentication: requestOptions.authentication as ArcGISIdentityManager,
  });
  const context = contextMngr.context;

  let token: string;
  if (requestOptions.authentication) {
    const session: ArcGISIdentityManager =
      requestOptions.authentication as ArcGISIdentityManager;
    token = session.token;
  }
  // compute base properties on project
  project = computeItemProps(model.item, project);
  // thumbnail url
  project.thumbnailUrl = getItemThumbnailUrl(model.item, requestOptions, token);

  project.view = {
    ...model.data.view,
    featuredImageUrl: model.data.view?.featuredImageUrl,
  };
  // Ensure we have a catalog and that its at the current schema
  project.catalog = upgradeCatalogSchema(project.catalog || {});

  /**
   * Features that can be disabled by the entity owner
   */
  project.features = processEntityFeatures(
    model.data.settings?.features || {},
    ProjectDefaultFeatures
  );

  project.links = computeLinks(model.item, requestOptions);

  const featuredMetricDisplays =
    project.view?.metricDisplays?.filter(
      (display) => display.visibility === MetricVisibility.featured
    ) || [];
  const metrics = project.metrics || [];
  (project.view || {})._layoutInterpolationProps = {
    featuredEmbed: project.view?.embeds?.[0],
    associatedEntitiesQuery: await getAssociatedEntitiesQuery(
      project as IHubProject,
      "initiative",
      context
    ),
    ...(featuredMetricDisplays.length > 0 && {
      featuredMetric1: {
        metric: metrics.find(
          (metric) => metric.id === featuredMetricDisplays[0].metricId
        ),
        display: {
          ...featuredMetricDisplays[0],
          scale: "m",
          border: true,
        },
      },
    }),
    ...(featuredMetricDisplays.length > 1 && {
      featuredMetric2: {
        metric: metrics.find(
          (metric) => metric.id === featuredMetricDisplays[1].metricId
        ),
        display: {
          ...featuredMetricDisplays[1],
          scale: "m",
          border: true,
        },
      },
    }),
    ...(featuredMetricDisplays.length > 2 && {
      featuredMetric3: {
        metric: metrics.find(
          (metric) => metric.id === featuredMetricDisplays[2].metricId
        ),
        display: {
          ...featuredMetricDisplays[2],
          scale: "m",
          border: true,
        },
      },
    }),
    ...(featuredMetricDisplays.length > 3 && {
      featuredMetric4: {
        metric: metrics.find(
          (metric) => metric.id === featuredMetricDisplays[3].metricId
        ),
        display: {
          ...featuredMetricDisplays[3],
          scale: "m",
          border: true,
        },
      },
    }),
  };

  // apply migrations
  project = applyProjectMigrations(project as IHubProject);

  // cast b/c this takes a partial but returns a full project
  return project as IHubProject;
}
