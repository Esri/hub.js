import { IHubProject } from "../core/types";
import { IQuery } from "../search/types";
import { IArcGISContext } from "../ArcGISContext";
import { getPendingEntityQuery } from "../associations/getPendingEntityQuery";
import { getRequestingEntityQuery } from "../associations/getRequestingEntityQuery";
import { getAssociatedEntityQuery } from "../associations/getAssociatedEntityQuery";

/**
 * Associated Initiatives are those that include the project
 * in their association query AND are identified by the project
 * via a typeKeyword (initiative|:id).
 *
 * This query can be passed into the Gallery to show initiatives
 * that are fully "associated" (two-way handshake) with a project
 * @param initiative
 * @returns {IQuery}
 */
export async function getAssociatedInitiativesQuery(
  project: IHubProject,
  context: IArcGISContext
): Promise<IQuery> {
  return getAssociatedEntityQuery(project, "initiative", context);
}

/**
 * Pending Initiatives are those that are identified by the project
 * via a typeKeyword (initiative|:id) but do NOT include the project
 * in their association query.
 *
 * This query can be passed into the Gallery to show "Pending"
 * Initiatives - those which the project has requested to be
 * associated with, but the initiative has not yet accepted.
 *
 * @param initiative
 * @returns {IQuery}
 */
export async function getPendingInitiativesQuery(
  project: IHubProject,
  context: IArcGISContext
): Promise<IQuery> {
  return getPendingEntityQuery(project, "initiative", context);
}

/**
 * Requesting Projects are those that identify with the initiative
 * via a typeKeyword (initiative|:id) but are NOT included in the
 * intiative's association query
 *
 * This query can be passed into the Gallery to show "Requesting"
 * Projects - those which have requested to be associated with
 * the initiative, but have not yet been accepted.
 *
 * @param initiative
 * @returns {IQuery}
 */
export async function getRequestingInitiativesQuery(
  project: IHubProject,
  context: IArcGISContext
): Promise<IQuery> {
  return getRequestingEntityQuery(project, "initiative", context);
}
