import { IArcGISContext } from "../ArcGISContext";
import { IHubInitiative } from "../core/types";
import { ResolvedMetrics } from "../metrics/metricsTypes";
import { resolveMetrics } from "../metrics/resolveMetrics";
import { preprocessMetrics } from "../metrics/preprocessMetrics";

/**
 * Resolve metrics for an Initiative.
 * @param initiative
 * @param context
 * @returns
 */

export async function resolveInitiativeMetrics(
  initiative: IHubInitiative,
  context: IArcGISContext
): Promise<ResolvedMetrics> {
  const metrics = preprocessMetrics(initiative);
  return await resolveMetrics(metrics, context);
}
