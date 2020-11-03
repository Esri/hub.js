import { collections } from "./collections";
import { downloadableTypes } from "./types";

const {
  app,
  dataset,
  document,
  event,
  feedback,
  initiative,
  map,
  other,
  site
} = collections;

const downloadableTypeKeywords: string[] = ["Data"];

const apiTypes: string[] = ["Feature Service", "Map Service", "Image Service"];

// TODO: remove this at next breaking version
// we're just keeping this for backwards compatibility
export const categories: { [key: string]: string[] } = {
  app: app.concat(feedback),
  dataset,
  document,
  event,
  initiative,
  map,
  other,
  site,
  downloadableTypes,
  downloadableTypeKeywords,
  apiTypes
};
