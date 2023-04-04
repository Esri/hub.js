import { IHubProject } from "../core/types";
import { IArcGISContext } from "../ArcGISContext";
import { ResolvedMetrics } from "../metrics/metricsTypes";
import { resolveMetrics } from "../metrics/resolveMetrics";
import { dereferenceProjectMetrics } from "./dereferenceProjectMetrics";

/**
 * Resolve metrics for a Hub Project.
 * @param initiative
 * @param context
 * @returns
 */

export function resolveProjectMetrics(
  initiative: IHubProject,
  context: IArcGISContext
): Promise<ResolvedMetrics> {
  const metrics = dereferenceProjectMetrics(initiative);
  return resolveMetrics(metrics, context);
}
