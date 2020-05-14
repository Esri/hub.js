import { getSectionDependencies } from "./get-section-dependencies";

import { ILayout } from "./types";

/**
 * Find all the section/row/card dependencies for the given layout
 * 
 * @param {ILayout} layout
 */
export const getLayoutDependencies = function getLayoutDependencies (layout : ILayout) {
  return layout.sections.reduce((deps, section) => {
    return deps.concat(getSectionDependencies(section));
  }, []);
};
