import { slugify } from "../../utils/slugify";
import { IEvent } from "../api/orval/api/orval-events";

/**
 * Builds a slug for the given IEvent record.
 * @param event An IEvent record
 * @returns the slug for the given IEvent record
 */
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
