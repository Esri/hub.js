import { TOMORROW } from "./tomorrow";

export const mockUserSession = {
  username: "vader",
  password: "123456",
  token: "fake-token",
  tokenExpires: TOMORROW,
  portal: "https://vader.maps.arcgis.com/sharing/rest",
} as any;
