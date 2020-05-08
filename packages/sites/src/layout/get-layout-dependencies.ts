import { getSectionDependencies } from "./get-section-dependencies";

import { ILayout } from "./types";

export const getLayoutDependencies = function getLayoutDependencies (layout : ILayout) {
  return layout.sections.reduce((deps, section) => {
    return deps.concat(getSectionDependencies(section));
  }, []);
};
