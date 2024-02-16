import { cloneObject } from "../util";
import { HubEntityType } from "./types/HubEntityType";

/**
 * History is a way to track a set of sites/projects/initiatives/pages that a user has visited
 * Any content can be added to the history, but there will be different limits for different types
 * Please see the addHistoryEntry function for more details
 */
export interface IHubHistory {
  // Modelled as an object so we can easily extend without requiring a schema change
  entries: IHubHistoryEntry[];
}

/**
 * History entry
 */
export interface IHubHistoryEntry {
  /**
   * Entity Type
   */
  type: HubEntityType;
  /**
   * What action was last taken on the entity
   * In the future this can expand to "replied to", "shared with" etc
   */
  action: "view" | "workspace";
  /**
   * Url the user visited
   */
  url: string;
  /**
   * Unique identifier for the entity
   */
  id: string;
  /**
   * Title of the entity
   */
  title: string;
  /**
   * Owner of the entity
   */
  owner?: string;
  /**
   * timestamp the entity was last visited
   */
  visited?: number;
  /**
   * Additional parameters that can be used to rehydrate the entity
   */
  params?: any;
}

/**
 * Add an entry to the history. This handles the limits per type,
 * and ensures that the most recent entry is at the top of the list.
 * This function does not persist the history, it only updates the object.
 * @param entry
 * @param history
 * @returns
 */
export function addHistoryEntry(
  entry: IHubHistoryEntry,
  history: IHubHistory
): IHubHistory {
  // Define limits to how many of each type of history we store
  const limits = {
    sites: 10,
    entities: 50,
  };

  // Anything other than "site" is considered an "entity" for history purposes
  // When we disply the list of history, we use the underlying type to determine the icon and route
  const type = entry.type === "site" ? "sites" : "entities";
  // get a clone of the existing entries
  let entries: IHubHistoryEntry[] = cloneObject(history.entries);
  // split into two arrays, one for the type and one for everything else
  const siteEntries = entries.filter((e) => e.type === "site");
  const otherEntries = entries.filter((e) => e.type !== "site");

  // Depending on the type, choose the list to work with
  if (entry.type === "site") {
    entries = siteEntries;
  } else {
    entries = otherEntries;
  }
  // If there is an existing entry, remove it
  entries = entries.filter((e) => e.id !== entry.id);
  // if the count of the type is below the limit, add the new entry to the start of the array
  if (entries.length < limits[type]) {
    entries.unshift(entry);
  } else {
    // otherwise, remove the last entry and add the new entry to the start of the array
    entries.pop();
    entries.unshift(entry);
  }
  // merge up the arrays and sort by visited date
  // depending on tne type, we may need to merge the arrays in a different order
  if (entry.type === "site") {
    history.entries = [...entries, ...otherEntries];
  } else {
    history.entries = [...siteEntries, ...entries];
  }

  // return the updated history
  return history;
}

/**
 * Remove a specific entry from the user's history
 * @param entry
 * @returns
 */
export function removeHistoryEntry(
  entry: IHubHistoryEntry,
  history: IHubHistory
): IHubHistory {
  // remove the entry from the history
  const updated = cloneObject(history);
  updated.entries = updated.entries.filter((e) => e.id !== entry.id);
  return updated;
}
