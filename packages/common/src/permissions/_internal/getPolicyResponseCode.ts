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
  { response: "invalid-permission", code: "PC113" },
  { response: "privilege-required", code: "PC114" },
  { response: "system-offline", code: "PC115" },
  { response: "system-maintenance", code: "PC116" },
  { response: "entity-required", code: "PC117" },
  { response: "not-authenticated", code: "PC118" },
  { response: "not-alpha-org", code: "PC119" },
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
