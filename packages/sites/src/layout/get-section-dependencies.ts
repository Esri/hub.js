import { getRowDependencies } from "./get-row-dependencies";

import { ISection } from "./types";

export const getSectionDependencies = function getSectionDependencies (section: ISection) {
  return section.rows.reduce((deps, row) => {
    return deps.concat(getRowDependencies(row));
  }, []);
};
 