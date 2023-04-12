/**
 * Takes the resources prop from an entity model and returns an array of
 * objects with a filename and resource to be created.
 *
 * @param {*} resources
 * @return {*}
 */
export function configureBaseResources(
  resources: Record<string, any>,
  entityResourceMap: Record<string, string>
): Array<{ filename: string; resource: any }> {
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
