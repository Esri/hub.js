import { WellKnownCollection } from "../search/wellKnownCatalog";

export const defaultSiteCollectionKeys: WellKnownCollection[] = [
  // TODO: add 'all' as a wellknown collection and figure out the
  // ramifications of doing so across the app. (or create a new
  // type that includes 'all')
  "all" as any,
  "dataset",
  "document",
  "site",
  "appAndMap",
];
