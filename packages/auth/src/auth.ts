/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { UserSession } from "@esri/arcgis-rest-auth";

// not an ES6 module, 900B, no dependencies
// i'd have to figure out how to get Rollup to bundle it
// const Cookies = require("js-cookie");
// https://www.npmjs.com/package/js-cookie

/*
i modified the jasmine.json to skip running auth tests in Node.js.
it'd probably be (much) smarter to just mock document/window
*/

/**
 * @browserOnly (sic)
 * Checks cookies/localStorage to see if the user is already signed in.
 * @returns just the token for now
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
    // if nothing is found, abort
    else reject("No evidence of authentication found.");
  });
}
