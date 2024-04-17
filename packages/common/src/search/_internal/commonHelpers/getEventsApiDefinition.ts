import { IApiDefinition } from "../../types/types";

export function getEventsApiDefinition(): IApiDefinition {
  // Currently, url is null because this is handled internally by the
  // events request method called by getEvents, which relies on
  // the URL defined in the request options.hubApiUrl
  return {
    type: "arcgis-hub",
    url: null,
  };
}
