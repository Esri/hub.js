import { IHubProject } from "../core/types";
import { IArcGISContext } from "../ArcGISContext";
import { ResolvedMetrics } from "../metrics/metricsTypes";
import { resolveMetrics } from "../metrics/resolveMetrics";
import { preprocessMetrics } from "../metrics/preprocessMetrics";

/**
 * Resolve metrics for a Hub Project.
 * @param project
 * @param context
 * @returns
 */
export function resolveProjectMetrics(
  project: IHubProject,
  context: IArcGISContext
): Promise<ResolvedMetrics> {
  const metrics = preprocessMetrics(project);
  return resolveMetrics(metrics, context);
}
