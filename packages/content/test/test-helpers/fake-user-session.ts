import { UserSession } from "@esri/arcgis-rest-auth";
import { TOMORROW } from "./tomorrow";

export const mockUserSession = new UserSession({
  username: "vader",
  password: "123456",
  token: "fake-token",
  tokenExpires: TOMORROW,
  portal: "https://vader.maps.arcgis.com/sharing/rest"
});
