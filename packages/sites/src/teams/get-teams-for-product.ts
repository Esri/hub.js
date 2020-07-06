import { HubProduct } from "./types";

export function getTeamsForProduct(product: HubProduct) {
  const teams = ["content", "core"];
  if (product === "premium") {
    teams.push("followers");
  }
  return teams;
}
