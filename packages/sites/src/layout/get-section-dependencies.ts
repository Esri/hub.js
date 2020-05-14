import { getRowDependencies } from "./get-row-dependencies";

import { ISection } from "./types";

/**
 * Find all the row and card dependencies for the given section
 * 
 * @param {ISection} section
 */
export const getSectionDependencies = function getSectionDependencies (section: ISection) {
  return section.rows.reduce((deps, row) => {
    return deps.concat(getRowDependencies(row));
  }, []);
};
 