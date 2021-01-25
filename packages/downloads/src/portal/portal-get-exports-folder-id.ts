import {
  createFolder,
  IAddFolderResponse,
  getUserContent
} from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * @private
 */
export function getExportsFolderId(
  authentication: UserSession
): Promise<string> {
  return getUserContent({ authentication })
    .then((userContent: any) => {
      const exportFolder = userContent.folders.find((folder: any) => {
        return folder.title === "item-exports";
      });

      if (exportFolder) {
        return { folder: exportFolder };
      }

      return createFolder({ authentication, title: "item-exports" });
    })
    .then((response: unknown) => {
      const { folder } = response as IAddFolderResponse;
      return folder.id;
    });
}
