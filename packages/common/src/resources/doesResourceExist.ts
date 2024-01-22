import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { getItemResources } from "@esri/arcgis-rest-portal";

export async function doesResourceExist(
  id: string,
  name: string,
  ro: IUserRequestOptions
): Promise<boolean> {
  return getItemResources(id, ro).then((resp) => {
    // if the resource exists, return true
    const foundResource = resp.resources.find((e: any) => {
      return e.resource === name;
    });
    return !!foundResource;
  });
}
