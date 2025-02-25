import { IItem, IUser } from "@esri/arcgis-rest-types";
import { IInitiativeModel } from "../types";
import { getProp } from "../objects";
import { findBy } from "../util";
import { hasBasePriv } from "./has-base-priv";

export interface IEventModel {
  initiative: IInitiativeModel;
  site: IItem;
  [propName: string]: any;
}

/**
 * Checks if user has access to edit an event in Hub
 * @param {IEventModel} model consolidated event model as consumed by Hub, contains the event feature, related initiative model, and attendees group
 * @param {IUser} user
 * @returns {boolean}
 */
export function canEditEvent(model: IEventModel, user: IUser): boolean {
  let res = false;
  if (hasBasePriv(user)) {
    const coreTeamId = model.initiative
      ? getProp(model, "initiative.item.properties.collaborationGroupId")
      : getProp(model, "site.properties.collaborationGroupId");
    const { groups = [] } = user;
    res = !!coreTeamId && !!findBy(groups, "id", coreTeamId);
  }
  return res;
}
