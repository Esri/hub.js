import { HubProduct } from "../../";

export function getTeamsForProduct(product: HubProduct) {
  const teams = ["content", "core"];
  if (product === "premium") {
    teams.push("followers");
  }
  return teams;
}
