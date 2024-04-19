import { slugify } from "../../utils/slugify";
import { IEvent } from "../api/orval/api/orval-events";

export function getEventSlug(event: IEvent): string {
  return (
    [slugify(event.title), event.id]
      .join("-")
      // remove double hyphens
      .split("-")
      .filter(Boolean)
      .join("-")
  );
}
