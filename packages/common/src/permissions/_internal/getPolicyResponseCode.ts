import { PolicyResponse } from "../types";

interface IPolicyLookup {
  response: PolicyResponse;
  code: string;
}

// TODO: Determine how to keep this in sycn with the PolicyResponse type
// Crappy tool https://jsbin.com/gojelov/edit?js,console,output
const policyResponseCodes: IPolicyLookup[] = [
  { response: "granted", code: "PC100" },
  { response: "org-member", code: "PC101" },
  { response: "not-org-member", code: "PC102" },
  { response: "group-member", code: "PC103" },
  { response: "not-group-member", code: "PC104" },
  { response: "not-group-admin", code: "PC105" },
  { response: "is-user", code: "PC106" },
  { response: "not-owner", code: "PC107" },
  { response: "not-licensed", code: "PC108" },
  { response: "not-licensed-available", code: "PC109" },
  { response: "not-available", code: "PC110" },
  { response: "not-granted", code: "PC111" },
  { response: "no-edit-access", code: "PC112" },
  { response: "edit-access", code: "PC113" },
  { response: "invalid-permission", code: "PC114" },
  { response: "privilege-required", code: "PC115" },
  { response: "system-offline", code: "PC116" },
  { response: "system-maintenance", code: "PC117" },
  { response: "entity-required", code: "PC118" },
  { response: "not-authenticated", code: "PC119" },
  { response: "not-alpha-org", code: "PC120" },
  { response: "property-missing", code: "PC121" },
  { response: "property-not-array", code: "PC122" },
  { response: "array-contains-invalid-value", code: "PC123" },
  { response: "array-missing-required-value", code: "PC124" },
  { response: "property-mismatch", code: "PC125" },
  { response: "user-not-group-member", code: "PC126" },
  { response: "user-not-group-manager", code: "PC127" },
  { response: "user-not-group-owner", code: "PC128" },
  { response: "assertion-property-not-found", code: "PC129" },
  { response: "assertion-failed", code: "PC130" },
  { response: "assertion-requires-numeric-values", code: "PC131" },
  { response: "property-match", code: "PC132" },
];

/**
 * Get a code that can be used for i18n or other purposes, based on the PolicyResponse
 * @param response
 * @returns
 */
export function getPolicyResponseCode(response: PolicyResponse): string {
  const entry = policyResponseCodes.find((x) => x.response === response);
  return entry?.code || "PC000";
}
