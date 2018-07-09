/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * Checks cookies/localStorage for existing sign-in information (Browser only).
 *
 * ```js
 * import { checkSignInStatus } from '@esri/hub-auth';
 *
 * const session = checkSignInStatus()
 * if (session) // user is already logged in!
 * ```
 *
 * @returns UserSession
 */
export function checkSignInStatus(): UserSession {
  /* istanbul ignore else */
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    let auth: string;
    let session: UserSession;

    // first check for an esri_auth cookie
    // https://stackoverflow.com/questions/10730362/get-cookie-by-name
    const value = "; " + document.cookie;
    const parts = value.split("; " + "esri_auth=");
    if (parts.length === 2) {
      auth = parts
        .pop()
        .split(";")
        .shift();
    }

    if (!auth) {
      // next try local storage
      auth = window.localStorage.getItem("torii-provider-arcgis");
    }
    if (auth) {
      const authJson = JSON.parse(decodeURIComponent(auth));

      // don't create a session from a stale token
      if (authJson.expires > Date.now()) {
        session = new UserSession({
          token: authJson.token,
          tokenExpires: new Date(authJson.expires)
        });

        return session;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}
