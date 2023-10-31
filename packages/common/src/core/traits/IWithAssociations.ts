import { IHubAssociationRules } from "../../associations";

export interface IWithAssociations {
  associations?: {
    group?: string;
    rules?: IHubAssociationRules
  };
  typeKeywords?: string[];
  [key: string]: any;
}
