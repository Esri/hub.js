import { IHubAssociationRules } from "../../associations";

/** properties for entities with associations */
export interface IWithAssociations {
  associations?: {
    /**
     * association group id - this is exposed as
     * its own property for convenience. It is
     * also included in the association rules
     * query as a group predicate.
     */
    groupId: string;
    /** association rules */
    rules: IHubAssociationRules;
  };
  typeKeywords?: string[];
  [key: string]: any;
}
