import { getWithDefault } from "../objects/get-with-default";
import { IPortal } from "@esri/arcgis-rest-portal";

export const getSubscriptionType = (portalSelf: IPortal) => {
  return getWithDefault(portalSelf, "subscriptionInfo.type", "Enterprise");
};
