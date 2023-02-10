import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { FetchReadMethodName, getItemResource } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";

export async function getResourcesByName(
  id: string,
  resourceNames: string[],
  requestOptions: IRequestOptions | IUserRequestOptions
): Promise<Array<{ name: string; resource: Promise<any> }>> {
  return Promise.all(
    resourceNames.map(async (name) => {
      return {
        name,
        resource: await getItemResource(id, {
          fileName: name,
          // Must be "arrayBuffer" | "blob" | "formData" | "json" | "text";
          readAs: name.split(".").pop() as FetchReadMethodName,
          ...requestOptions,
        }),
      };
    })
  );
}
