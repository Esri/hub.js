import { IHubInitiative } from "../core/types";
import { IQuery } from "../search/types";
import { IArcGISContext } from "../ArcGISContext";
import { getPendingEntitiesQuery } from "../associations/getPendingEntitiesQuery";
import { getRequestingEntitiesQuery } from "../associations/getRequestingEntitiesQuery";
import { getAssociatedEntitiesQuery } from "../associations/getAssociatedEntitiesQuery";
import { requestAssociation } from "../associations/requestAssociation";
import { breakAssociation } from "../associations/breakAssociation";

/**
 * Associated projects are those that identify with the initiative
 * via a typeKeyword (initiative|:id) AND are included in the
 * initiative's association query.
 *
 * This query can be passed into the Gallery to show projects that
 * are fully "associated" (two-way handshake) with an initiative
 * @param initiative
 * @returns {IQuery}
 */
export async function getAssociatedProjectsQuery(
  initiative: IHubInitiative,
  context: IArcGISContext
): Promise<IQuery> {
  return getAssociatedEntitiesQuery(initiative, "project", context);
}

/**
 * Pending Projects are those that are included in the initiative's
 * association query but do NOT identify with the initiative
 * via a typeKeyword (initiative|:id).
 *
 * This query can be passed into the Gallery to show "Pending"
 * Projects - those which the initiative has requested to be
 * associated with, but the project has not yet accepted.
 *
 * @param initiative
 * @returns {IQuery}
 */
export async function getPendingProjectsQuery(
  initiative: IHubInitiative,
  context: IArcGISContext
): Promise<IQuery> {
  return getPendingEntitiesQuery(initiative, "project", context);
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
export async function getRequestingProjectsQuery(
  initiative: IHubInitiative,
  context: IArcGISContext
): Promise<IQuery> {
  return getRequestingEntitiesQuery(initiative, "project", context);
}

/**
 * When an initiative sends an "outgoing" request to associate
 * with a project, it "includes" the project in its association
 * group
 *
 * @param initiative initiative entity requesting association
 * @param projectId id of the project the intiative is requesting association with
 * @param context
 */
export async function requestProjectAssociation(
  initiative: IHubInitiative,
  projectId: string,
  context: IArcGISContext
): Promise<void> {
  await requestAssociation(initiative, "project", projectId, context);
}

/**
 * When an initiative accpets an "incoming" request to associate
 * with a project, it "includes" the project in its association
 * group
 *
 * Note: this function is identical to "requestProjectAssociation".
 * We expose it under a new name for clarity purposes
 *
 * @param initiative initiative entity requesting association
 * @param projectId id of the project the intiative is requesting association with
 * @param context
 */
export async function acceptProjectAssociation(
  initiative: IHubInitiative,
  projectId: string,
  context: IArcGISContext
): Promise<void> {
  await requestAssociation(initiative, "project", projectId, context);
}

/**
 * When an initiative decides it wants to "disconnect" itself from
 * a project, it removes the project from its association group
 *
 * @param initiative initiative initiating the disconnection
 * @param initiativeId id of the project the initiative wants to disconnect from
 */
export async function breatkProjectAssociation(
  initiative: IHubInitiative,
  projectId: string,
  context: IArcGISContext
): Promise<void> {
  await breakAssociation(initiative, "project", projectId, context);
}
