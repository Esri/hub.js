import { IHubSurvey } from "../core/types/IHubSurvey";

/** Default values for a new IHubSurvey */
export const DEFAULT_SURVEY: Partial<IHubSurvey> = {
  schemaVersion: 1,
  catalog: { schemaVersion: 0 },
  name: "",
  tags: [],
  typeKeywords: [],
};
