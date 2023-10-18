export interface IWithAssociations {
  associations?: {
    group?: string;
  };
  typeKeywords?: string[];
  [key: string]: any;
}
