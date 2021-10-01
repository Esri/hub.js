import { HubProduct } from "../../";

interface ITeamPropMap {
  content: string;
  core: string;
  followers?: string;
}

/**
 * Return a map from the team names to the property names
 * @param {string} product Product Name (basic, premium, enterprise)
 */
export function getTeamPropertiesMapForProduct(
  product: HubProduct
): ITeamPropMap {
  // basic and enterprise, it's just the content group
  const map: ITeamPropMap = {
    content: "contentGroupId",
    core: "collaborationGroupId",
  };
  // premium, we add core and followers
  if (product === "premium") {
    map.followers = "followersGroupId";
  }
  return map;
}
