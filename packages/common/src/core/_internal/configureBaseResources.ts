/**
 * Takes the resources prop from an entity model and returns an array of
 * objects with a filename and resource to be created.
 *
 * @param {*} resources
 * @return {*}
 */
export function configureBaseResources(
  resources: any,
  entityResourceMap: any
): Array<{ filename: string; resource: any }> {
  // Set up obj tracking resource prop && filename (KEEP IN SYNC WITH getPropertyMap()
  // for additional resources!)
  return Object.entries(resources).reduce((acc, resourceProp) => {
    const fileName = entityResourceMap[resourceProp[0]];
    if (fileName) {
      acc.push({
        filename: fileName,
        resource: resourceProp[1],
      });
    }
    return acc;
  }, []);
}
