import { IGroup } from "@esri/arcgis-rest-types";
import { PropertyMapper } from "../../core/_internal/PropertyMapper";
import { IHubGroup } from "../../core/types/IHubGroup";
import { computeProps } from "./computeProps";
import { getPropertyMap } from "./getPropertyMap";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

/**
 * Convert an IGroup to a Hub Group
 * @param group
 * @param requestOptions
 */

export function convertGroupToHubGroup(
  group: IGroup,
  requestOptions: IUserRequestOptions
): IHubGroup {
  const mapper = new PropertyMapper<Partial<IHubGroup>, IGroup>(
    getPropertyMap()
  );
  const hubGroup = mapper.storeToEntity(group, {}) as IHubGroup;
  return computeProps(group, hubGroup, requestOptions);
}
