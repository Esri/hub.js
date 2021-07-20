import {
  addGroupUsers,
  IAddGroupUsersResult,
  IUser,
} from "@esri/arcgis-rest-portal";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";

export function autoAddUsersAsAdmins(
  id: string,
  admins: IUser[],
  authentication: IAuthenticationManager
): Promise<IAddGroupUsersResult> {
  let response = Promise.resolve(null);
  if (admins.length) {
    const args = {
      id,
      admins: admins.map((a) => a.username),
      authentication,
    };
    response = addGroupUsers(args);
  }
  return response;
}
