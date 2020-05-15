import { cloneObject } from '@esri/hub-common';

import { convertSection } from "./convert-section";
import { ILayout, ITemplatizedLayout } from "./types";

/**
 * Convert a layout to a templatized version of itself
 * @param {ILayout} layout the layout to templatize
 */
export const convertLayoutToTemplate = function convertLayoutToTemplate (layout : ILayout) : ITemplatizedLayout {
  if (!layout) {
    return null;
  }

  // walk the sections, rows, cards... then call to fn's to convert specific cards...
  const converted = layout.sections.reduce((acc, section) => {
    const result = convertSection(section);

    acc.assets = acc.assets.concat(result.assets);
    acc.sections.push(result.section);
    return acc;
  }, { assets: [], sections: [] });

  // assemble the response
  const result = {
    assets: converted.assets,
    layout: {
      sections: converted.sections
    }
  } as ITemplatizedLayout;

  if (layout.header) {
    result.layout.header = cloneObject(layout.header);
  }

  if (layout.footer) {
    result.layout.footer = cloneObject(layout.footer);
  }

  return result;
};

