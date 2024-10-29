/**
 * @private
 * Get the major version from a semantic version string
 *
 * @param version dot delimited semantic version
 * @returns the major version of the semantic version
 */
export function getMajorVersion(version: string) {
  return version.split(".")[0];
}
