import { getRowDependencies } from "./get-row-dependencies";

import { ISection } from "./types";

/**
 * Find all the row and card dependencies for the given section
 *
 * @param {ISection} section
 */
export function getSectionDependencies(section: ISection): string[] {
  return section.rows.reduce((deps, row) => {
    return deps.concat(getRowDependencies(row));
  }, []);
}
