import { IItemTemplate, cloneObject, getProp } from "@esri/hub-common";

/**
 * Ensure that the item template has `:optional` on the item.properties.* team
 * properties. Does not mutate the passed in object - returns a clone.
 * @param {Object} itemTemplate Item Template to work with
 */
export function ensureOptionalGroupsTemplating(itemTemplate: IItemTemplate) {
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
