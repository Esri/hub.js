import { getIncludesAndIdentifiesQuery } from "../associations/internal/getIncludesAndIdentifiesQuery";
import { IHubInitiative } from "../core/types";
import { IQuery } from "../search/types";
import { IArcGISContext } from "../ArcGISContext";
import { getPendingEntityQuery } from "../associations/getPendingEntityQuery";
import { getRequestingEntityQuery } from "../associations/getRequestingEntityQuery";
import { getAssociatedEntityQuery } from "../associations/getAssociatedEntityQuery";

export interface IHubInitiativeAssociation {
  entity: IHubInitiative;
  type: "project"; // as
}
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
  return getAssociatedEntityQuery(initiative, "project", context);
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
  return getPendingEntityQuery(initiative, "project", context);
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
  return getRequestingEntityQuery(initiative, "project", context);
}
