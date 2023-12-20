import { IHubAssociationRules } from "../../associations";

/** properties for entities with associations */
export interface IWithAssociations {
  associations?: {
    /** association group id */
    groupId: string;
    /** association rules */
    rules: IHubAssociationRules;
  };
  typeKeywords?: string[];
  [key: string]: any;
}
