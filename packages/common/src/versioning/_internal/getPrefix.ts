/**
 * Returns the prefix (the "folder" name)
 * @param versionId
 * @private
 */
export function getPrefix(versionId: string) {
  return `hubVersion_${versionId}`;
}
