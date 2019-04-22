/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";
import { UserSession, IOAuth2Options } from "@esri/arcgis-rest-auth";

/**
 * A thin wrapper around [`UserSession.completeOAuth2()`](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/#completeOAuth2) that sets search tags and other relevant metadata for newly created community users.
 */
/* istanbul ignore next */
export function completeOAuth2(
  options: IOAuth2Options,
  win: any = window
): Promise<UserSession> {
  const match = win.location.href.match(
    /access_token=(.+)&expires_in=.+&username=([^&]+)/
  );

  const token = match[1];
  const user = decodeURIComponent(match[2]);
  const baseUrl = `https://www.arcgis.com/sharing/rest/community/users/${user}`;

  return request(baseUrl, {
    params: { token },
    httpMethod: "GET"
  }).then(response => {
    if (Date.now() - response.created < 5000) {
      return request(`${baseUrl}/update`, {
        params: {
          token,
          tags: ["hubRole:participant", `org:${response.orgId}`],
          access: "public"
        }
      }).then(() => {
        return UserSession.completeOAuth2(options);
      });
    } else {
      return UserSession.completeOAuth2(options);
    }
  });
}
