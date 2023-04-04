import { IArcGISContext, ResolvedMetrics } from "../index";
import { resolveMetrics } from "../metrics/resolveMetrics";
import { IHubInitiative } from "../core/types";
import { dereferenceInitiativeMetrics } from "./dereferenceInitiativeMetrics";

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
  const metrics = dereferenceInitiativeMetrics(initiative);
  return await resolveMetrics(metrics, context);
}
