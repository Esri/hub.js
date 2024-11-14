import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { TOMORROW } from "./tomorrow";

export const mockUserSession = new ArcGISIdentityManager({
  username: "vader",
  password: "123456",
  token: "fake-token",
  tokenExpires: TOMORROW,
  portal: "https://vader.maps.arcgis.com/sharing/rest"
});
