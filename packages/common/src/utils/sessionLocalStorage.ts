import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * Remove any serialized sessions associated with the passed clientId
 * from a browser's local storage
 * @param clientId oAuth Client Id
 * @param win optional window (used for testing)
 */
export function clearSession(
  clientId: string,
  /* istanbul ignore next */
  win: any = window
): void {
  if (win.localStorage) {
    win.localStorage.removeItem(`__CONTEXT_${clientId}`);
  }
}

/**
 * Re-hydrate a UserSession from a browser's local storage.
 * If not found,
 * @param clientId oAuth Client Id
 * @param win optional window (used for testing)
 * @returns
 */
export function getSession(
  clientId: string,
  /* istanbul ignore next */
  win: any = window
): UserSession | null {
  let result: UserSession | null = null;
  if (win.localStorage) {
    const serializedSession = win.localStorage.getItem(`__CONTEXT_${clientId}`);
    if (serializedSession) {
      result = UserSession.deserialize(serializedSession);
    }
  }
  return result;
}

/**
 * Serialize a UserSession into a browser's local storage
 * @param clientId oAuth Client Id
 * @param session UserSession
 * @param win optional window (used for testing)
 */
export function saveSession(
  clientId: string,
  session: UserSession,
  /* istanbul ignore next */
  win: any = window
): void {
  if (win.localStorage) {
    win.localStorage.setItem(`__CONTEXT_${clientId}`, session.serialize());
  }
}
