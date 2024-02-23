import { IHubFeedback } from "../core/types/IHubFeedback";

/** Default values for a new IHubFeedback */
export const DEFAULT_FEEDBACK: Partial<IHubFeedback> = {
  schemaVersion: 1,
  catalog: { schemaVersion: 0 },
  name: "",
  tags: [],
  typeKeywords: [],
};
