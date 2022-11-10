import { PolicyResponse } from "../types";

interface IPolicyLookup {
  response: PolicyResponse;
  code: string;
}

const policyResponseCodes: IPolicyLookup[] = [
  { response: "granted", code: "PC001" },
  { response: "org-member", code: "PC002" },
  { response: "not-org-member", code: "PC003" },
  { response: "group-member", code: "PC004" },
  { response: "not-group-member", code: "PC005" },
  { response: "is-user", code: "PC006" },
  { response: "not-owner", code: "PC007" },
  { response: "not-licensed", code: "PC008" },
  { response: "not-available", code: "PC009" },
  { response: "not-granted", code: "PC010" },
  { response: "no-edit-access", code: "PC011" },
  { response: "invalid-permission", code: "PC012" },
  { response: "privilege-required", code: "PC013" },
  { response: "system-offline", code: "PC014" },
  { response: "system-maintenance", code: "PC015" },
  { response: "not-licensed-available", code: "PC016" },
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
