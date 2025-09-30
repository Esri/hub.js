import { IArcGISContext } from "../../types/IArcGISContext";
import { IPermissionPolicy } from "../types/IPermissionPolicy";
import { IPolicyCheck } from "../types/IPolicyCheck";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * Gate access based on the platform version (portal.currentVersion).
 * If the currentVersion is less than the policy.platformVersion, access is denied.
 * This is used to limit access to features that need to roll out with a
 * specific ArcGISOnline version. This should not be used with Enterprise.
 * @param policy
 * @param context
 * @param _entity
 * @returns
 */
export function checkPlatformVersion(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  _entity?: Record<string, any>
): IPolicyCheck[] {
  const checks: IPolicyCheck[] = [];
  // only apply if a platformVersion is specified in the policy
  if (policy.platformVersion) {
    // parse the currentVersion as a float (e.g. "2024.1" -> 2024.1)
    // and compare to the policy.platformVersion
    // which is also a float (e.g. 2024.1)
    // if currentVersion < platformVersion, deny access
    // e.g. currentVersion 2024.0 < platformVersion 2024.1 -> deny
    // e.g. currentVersion 2024.1 >= platformVersion 2024.1 -> allow
    // e.g. currentVersion 2024.2 >= platformVersion 2024.1 -> allow
    const currentVersion = parseFloat(context.portal.currentVersion);
    if (currentVersion < policy.platformVersion) {
      checks.push({
        response: "platform-version-not-met",
        value: context.portal.currentVersion as string,
        code: getPolicyResponseCode("platform-version-not-met"),
        name: "Platform Version Check",
      });
    } else {
      checks.push({
        response: "granted",
        value: context.portal.currentVersion as string,
        code: getPolicyResponseCode("granted"),
        name: "Platform Version Check",
      });
    }
  }

  return checks;
}
