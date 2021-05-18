import { UserSession } from "@esri/arcgis-rest-auth";
import { HubSession } from "./HubSession";

/**
 * Build a Hub Session
 *
 * @export
 * @param {UserSession} userSession
 * @return {Promise<HubSession>}
 */
export async function buildHubSession(
  userSession: UserSession
): Promise<HubSession> {
  const hubSession = HubSession.build(userSession);
  return hubSession.init();
}
