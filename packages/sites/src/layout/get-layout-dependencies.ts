import { getSectionDependencies } from "./get-section-dependencies";

import { ILayout } from "./types";

/**
 * Find all the section/row/card dependencies for the given layout
 *
 * @param {ILayout} layout
 */
export function getLayoutDependencies(layout: ILayout): string[] {
  return layout.sections.reduce((deps, section) => {
    return deps.concat(getSectionDependencies(section));
  }, []);
}
