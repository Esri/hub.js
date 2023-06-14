import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * DEPRECATED: Applications should manage storage/retrieval of serialized ArcGISContexts.
 * Please see ArcGISContextManager.serialize(...) and ArcGISContextManager.deserialize(...)
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
 * DEPRECATED: Applications should manage storage/retrieval of serialized ArcGISContexts.
 * Please see ArcGISContextManager.serialize(...) and ArcGISContextManager.deserialize(...)
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
  // tslint:disable-next-line
  console.warn(
    "getSession is deprecated. App should handle storage/retrieval and use ArcGISContextManager.deserialize(...) instead."
  );
  if (win.localStorage) {
    const serializedSession = win.localStorage.getItem(`__CONTEXT_${clientId}`);
    if (serializedSession) {
      result = UserSession.deserialize(serializedSession);
    }
  }
  return result;
}

/**
 * DEPRECATED: Applications should manage storage/retrieval of serialized ArcGISContexts.
 * Please see ArcGISContextManager.serialize(...) and ArcGISContextManager.deserialize(...)
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
  // tslint:disable-next-line
  console.warn(
    "saveSession is deprecated. App should handle storage/retrieval and use ArcGISContextManager.serialize(...) instead."
  );
  if (win.localStorage) {
    win.localStorage.setItem(`__CONTEXT_${clientId}`, session.serialize());
  }
}
