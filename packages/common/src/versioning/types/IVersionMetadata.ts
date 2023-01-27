/**
 * Metadata pertaining to the version
 * This is what we get back when we search for versions of an entity.
 */
export interface IVersionMetadata {
  access?: string;
  created: number;
  creator: string;
  id: string;
  name?: string;
  parent?: string;
  path: string;
  size?: number;
  updated: number;
}
