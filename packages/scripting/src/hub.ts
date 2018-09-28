/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { searchInitiatives } from "@esri/hub-initiatives";
import { ISearchRequestOptions } from "@esri/arcgis-rest-items";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";

/**
 * @returns not much
 */
export class Hub {
  readonly session: IAuthenticationManager;

  constructor(options: any) {
    if (options) {
      this.session = new UserSession(options);
    }
  }

  /**
   * Search for initiatives
   *
   * @param {(string | ISearchRequestOptions)} options
   * @returns Promise that resolves with the search results
   * @memberof Hub
   */
  searchInitiatives(options: string | ISearchRequestOptions) {
    const opts = this.constructSearchRequestOptions(options);
    if (this.session) {
      opts.authentication = this.session;
    }
    return searchInitiatives(opts);
  }

  private constructSearchRequestOptions(
    options: string | ISearchRequestOptions
  ): ISearchRequestOptions {
    // default search is all initiatives
    const opts = {
      searchForm: {
        q: "type: Hub Initiative"
      }
    };
    // if we just got a string, attach it in as the q
    if (typeof options === "string") {
      opts.searchForm.q = `${options} AND type: Hub Initiative`;
    } else if (options.searchForm) {
      opts.searchForm = options.searchForm;
    }
    return opts as ISearchRequestOptions;
  }

  // private ensureAuth(options:any):Promise<any> {
  //   let authPrms;
  //   // if a session exists, use it
  //   if (this.session) {
  //     authPrms = Promise.resolve(this.session);
  //   } else {
  //     // if we have authOptions
  //     if (this.authOptions) {
  //       // get a session
  //       authPrms = this.validateAuth(options);
  //     } else {
  //       // return nothing
  //       return Promise.resolve(null);
  //     }
  //   }
  //   return authPrms;
  // }

  // private validateAuth(options:any):Promise<IAuthenticationManager> {
  //   // options can include: username, password, portal, token
  //   const opts = {
  //     params: options
  //   } as ITokenRequestOptions;
  //   const session = new UserSession(options);
  //   return session.refreshSession(opts)
  //     .then((session: UserSession) => {
  //       this.hasValidAuth = true;
  //       this.session = session;
  //       return session as IAuthenticationManager;
  //     })
  //     .catch((ex: any) => {
  //       throw new Error(`Error authorizing. ${ex}`);
  //     })
  // }
}
