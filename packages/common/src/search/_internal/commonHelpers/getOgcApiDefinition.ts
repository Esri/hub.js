import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IApiDefinition } from "../../types/types";

export function getOgcApiDefinition(
  options: IHubSearchOptions
): IApiDefinition {
  const umbrellaDomain = new URL(options.requestOptions.hubApiUrl).hostname;
  return {
    type: "arcgis-hub",
    url: `https://${umbrellaDomain}/api/search/v1`,
  };
}
