import { EntityCapabilities, Capability } from "./types";

/**
 * Take an entity's capabilities and merge them with the default capabilities ensuring that only the capabilities defined in the business rules are allowed through.
 * @param entityCapabilities
 * @param defaultCapabilities
 * @returns
 */
export function processEntityCapabilities(
  entityCapabilities: EntityCapabilities,
  defaultCapabilities: EntityCapabilities
): EntityCapabilities {
  // Extend the default capabilities with the entity capabilities
  const capabilities = { ...defaultCapabilities, ...entityCapabilities };

  // Remove any capabilities that are not in the default capabilities hash.
  // this prevents enabling capabilities that are not defined in hub business rules
  const defaultKeys = Object.keys(defaultCapabilities);
  const keysToRemove = Object.keys(capabilities).reduce((acc, key) => {
    if (!defaultKeys.includes(key)) {
      acc.push(key as Capability);
    }
    return acc;
  }, []);
  // remove any keys that are not in the default capabilities hash
  keysToRemove.forEach((key: Capability) => {
    delete capabilities[key];
  });
  return capabilities;
}
