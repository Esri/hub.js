import { IItemTemplate, cloneObject, getProp } from "@esri/hub-common";

/**
 * We have updated aspects of the site templating logic, and now we need to
 * ensure that the groupId properties in the item template have :optional
 * if they are defined. This function simply does that.
 * @param {Object} itemTemplate template for the item part of the site
 * @private
 */
export function _ensureOptionalGroupsTemplating(itemTemplate: IItemTemplate) {
  const props = ["collaborationGroupId", "contentGroupId", "followersGroupId"];
  const tmpl = cloneObject(itemTemplate);
  props.forEach(prop => {
    const val = getProp(tmpl, `properties.${prop}`);
    if (val) {
      if (val.match(/^\{\{.*\}\}$/)) {
        if (!val.match(/:optional\}\}$/g)) {
          // replace it
          tmpl.properties[prop] = val.replace("}}", ":optional}}");
        }
      } else {
        delete tmpl.properties[prop];
      }
    }
  });
  return tmpl;
}
