import { setItemAccess as setItemAccessPortal } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../../ArcGISContext";
import { IHubItemEntity } from "../types/IHubItemEntity";
import { SettableAccessLevel } from "../types/types";
import HubError from "../../HubError";

export async function setItemAccess(
  access: SettableAccessLevel,
  entity: IHubItemEntity,
  context: IArcGISContext
) {
  if (!context.currentUser) {
    throw new HubError(
      "Change item access",
      "Cannot change item access when no user is logged in."
    );
  }
  await setItemAccessPortal({
    id: entity.id,
    access,
    owner: entity.owner,
    authentication: context.session,
  });
}
