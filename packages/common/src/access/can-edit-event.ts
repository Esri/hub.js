import { IUser } from "@esri/arcgis-rest-types";
import { IInitiativeModel } from "../types";
import { getProp } from "../objects";
import { findBy } from "../util";
import { hasBasePriv } from "./has-base-priv";

export interface IEventModel {
  [propName: string]: any;
  initiative: IInitiativeModel;
}

/**
 *
 * @param {IEventModel} model
 * @param {IUser} currentUser
 * @returns {boolean}
 */
export function canEditEvent(model: IEventModel, currentUser?: IUser): boolean {
  let res = false;
  if (hasBasePriv(currentUser)) {
    const coreTeamId = getProp(
      model,
      "initiative.item.properties.collaborationGroupId"
    );
    const groups = currentUser.groups || [];
    res = !!coreTeamId && !!findBy(groups, "id", coreTeamId);
  }
  return res;
}
