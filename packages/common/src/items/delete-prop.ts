/**
 * Delete a property from an object using a deep path
 * MODIFIES PASSED TARGET
 * @param {Object} target Object from which we want to delete the property
 * @param {string} path Dotted path to the property we want to delete
 */
export function deleteProp(target: Record<string, any>, lookupStr: string) {
  if (typeof target !== "object" || target === null) return;
  if (typeof lookupStr !== "string") return;

  const lookupKeys = lookupStr.split(".");

  for (let i = 0; i < lookupKeys.length - 1; i++) {
    if (!target.hasOwnProperty(lookupKeys[i])) return;
    target = target[lookupKeys[i]];
  }

  delete target[lookupKeys[lookupKeys.length - 1]];
}
