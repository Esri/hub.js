/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * Checks cookies/localStorage for existing sign-in information (Browser only).
 *
 * ```js
 * import { checkSignInStatus } from '@esri/hub-auth';
 *
 * checkSignInStatus()
 *   .then(session => session); // ready to go!
 *   .catch() // time to initiate login
 * ```
 *
 * @returns UserSession
 */
export function checkSignInStatus(): Promise<UserSession> {
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
    session = new UserSession({
      token: authJson.token,
      tokenExpires: new Date(authJson.expires)
    });
  }

  // since we're isolating synchronous logic, is it even helpful to return a promise?
  return new Promise((resolve, reject) => {
    if (session) resolve(session);
    else reject("No evidence of authentication found.");
  });
}
