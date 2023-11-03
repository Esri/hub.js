import { IHubProject } from "../core/types";
import { IQuery } from "../search/types";
import { IArcGISContext } from "../ArcGISContext";
import { getPendingEntitiesQuery } from "../associations/getPendingEntitiesQuery";
import { getRequestingEntitiesQuery } from "../associations/getRequestingEntitiesQuery";
import { getAssociatedEntitiesQuery } from "../associations/getAssociatedEntitiesQuery";
import { requestAssociation } from "../associations/requestAssociation";
import { breakAssociation } from "../associations/breakAssociation";

/**
 * Associated Initiatives are those that include the project
 * in their association query AND are identified by the project
 * via a typeKeyword (initiative|:id).
 *
 * This query can be passed into the Gallery to show initiatives
 * that are fully "associated" (two-way handshake) with a project
 * @param project
 * @param context
 * @returns {IQuery}
 */
export async function getAssociatedInitiativesQuery(
  project: IHubProject,
  context: IArcGISContext
): Promise<IQuery> {
  return getAssociatedEntitiesQuery(project, "initiative", context);
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
 * @param project project entity
 * @param context
 * @returns {IQuery}
 */
export async function getPendingInitiativesQuery(
  project: IHubProject,
  context: IArcGISContext
): Promise<IQuery> {
  return getPendingEntitiesQuery(project, "initiative", context);
}

/**
 * Requesting Initiatives are those which include the project
 * in their association query but are NOT identified via a
 * typeKeyword (initiative|:id) by the project
 *
 * This query can be passed into the Gallery to show "Requesting"
 * Initiatives - those which have requested to be associated with
 * the Project, but have not yet been accepted.
 *
 * @param project project entity
 * @param context
 * @returns {IQuery}
 */
export async function getRequestingInitiativesQuery(
  project: IHubProject,
  context: IArcGISContext
): Promise<IQuery> {
  return getRequestingEntitiesQuery(project, "initiative", context);
}

/**
 * When a project sends an "outgoing" request to associate
 * with an initiative, it "identifies" with the initiative
 * via a typeKeyword (initiative|:id)
 *
 * @param project project entity requesting association
 * @param initiativeId id of the initiative the project is requesting association with
 * @param context
 */
export async function requestInitiativeAssociation(
  project: IHubProject,
  initiativeId: string,
  context: IArcGISContext
): Promise<void> {
  await requestAssociation(project, "initiative", initiativeId, context);
}

/**
 * When a project accepts an "incoming" request to associate
 * with an initiative, it "identifies" with the initiative
 * via a typeKeyword (initiative|:id)
 *
 * Note: this function is identical to "requestInitiativeAssociation".
 * We expose it under a new name for clarity purposes
 *
 * @param project project entity requesting association
 * @param initiativeId id of the initiative the project is requesting association with
 * @param context
 */
export async function acceptInitiativeAssociation(
  project: IHubProject,
  initiativeId: string,
  context: IArcGISContext
): Promise<void> {
  await requestAssociation(project, "initiative", initiativeId, context);
}

/**
 * When a project decides it wants to "disconnect" itself from
 * an initiative, it removes the initiative identifier (initiative|:id)
 * from its typeKeywords
 *
 * @param project project initiating the disconnection
 * @param initiativeId id of the initiative the project wants to disconnect from
 */
export async function breakInitiativeAssociation(
  project: IHubProject,
  initiativeId: string,
  context: IArcGISContext
): Promise<void> {
  await breakAssociation(project, "initiative", initiativeId, context);
}
