import { IArcGISContext } from "../ArcGISContext";
import { getProp, getWithDefault } from "../objects";
import { checkLicense } from "./_internal/checkLicense";
import { getPermissionPolicy } from "./HubPermissionPolicies";
import { Permission, isPermission } from "./types/Permission";
import { getPolicyResponseCode } from "./_internal/getPolicyResponseCode";
import { checkAuthentication } from "./_internal/checkAuthentication";
import { checkOwner } from "./_internal/checkOwner";
import { checkEdit } from "./_internal/checkEdit";
import { checkPrivileges } from "./_internal/checkPrivileges";
import { checkEntityPolicy } from "./_internal/checkEntityPolicy";
import { checkAssertions } from "./_internal/checkAssertions";
import { checkParents } from "./_internal/checkParents";
import { checkEnvironment } from "./_internal/checkEnvironment";
import { checkAvailability } from "./_internal/checkAvailability";
import { checkServiceStatus } from "./_internal/checkServiceStatus";
import { PermissionCheckFunction } from "./_internal/PermissionCheckFunction";
import { IPermissionAccessResponse } from "./types/IPermissionAccessResponse";
import { PolicyResponse } from "./types/PolicyResponse";
import { IPolicyCheck } from "./types/IPolicyCheck";
import { IEntityPermissionPolicy } from "./types/IEntityPermissionPolicy";
import { IUserHubSettings } from "../utils";

/**
 * Type to allow either an entity or and entity and label to be
 * passed into `checkPermission`
 */
export type EntityOrOptions =
  | Record<string, any>
  | {
      entity?: Record<string, any>;
      label: string;
    };

/**
 * Check a permission against the system policies, and possibly an entity policy
 * Note: Calls that fail will automatically be logged to the console. Additional
 * context for the call can be passed via `.label` on the `entityOrOptions` argument.
 * @param permission
 * @param context
 * @param entityOrOptions
 * @returns
 */
export function checkPermission(
  permission: Permission,
  context: IArcGISContext,
  entityOrOptions?: EntityOrOptions
): IPermissionAccessResponse {
  const label = entityOrOptions?.label || "";
  const entity = entityOrOptions?.entity || entityOrOptions;

  // Is this even a valid permission?
  if (!isPermission(permission)) {
    const invalidPermissionResponse = {
      policy: permission,
      access: false,
      response: "invalid-permission",
      code: getPolicyResponseCode("invalid-permission"),
      checks: [],
    } as IPermissionAccessResponse;
    logResponse(invalidPermissionResponse, label);
    return invalidPermissionResponse;
  }

  // Get the system policy for this permission
  const systemPolicy = getPermissionPolicy(permission);

  // handle null systemPolicy
  if (!systemPolicy) {
    const missingPolicyResponse = {
      policy: permission,
      access: false,
      response: "no-policy-exists",
      code: getPolicyResponseCode("no-policy-exists"),
      checks: [],
    } as IPermissionAccessResponse;
    logResponse(missingPolicyResponse, label);
    return missingPolicyResponse;
  }

  const flagging = {
    hasFlag: false,
    value: false,
    type: "none",
  };

  // Entity Feature Flags
  // aka how we disable "features" on a per-entity basis

  // Is this policy configurable by the entity?
  if (systemPolicy.entityConfigurable) {
    // Has the entity provided a flag value?
    if (entity?.features?.hasOwnProperty(permission)) {
      flagging.hasFlag = true;
      flagging.value = entity.features[permission];
      flagging.type = "entity";
    }
  }

  // Feature Flags
  // Passed in from the application when context is created,
  // these override entity flags, so they are checked after
  if (context.featureFlags?.hasOwnProperty(permission)) {
    flagging.hasFlag = true;
    flagging.value = context.featureFlags[permission];
    flagging.type = "feature";
  }

  // We also check the context.userHubSettings.preview array
  // which can also be used to enable features.
  if (context.userHubSettings?.preview) {
    const preview = getWithDefault(
      context,
      "userHubSettings.preview",
      {}
    ) as IUserHubSettings["preview"];
    Object.keys(preview).forEach((key) => {
      // only set the flag if it's true, otherwise delete the flag so we revert to default behavior
      if (
        permission === `hub:feature:${key}` &&
        getProp(preview, key) === true
      ) {
        flagging.hasFlag = true;
        flagging.value = true;
        flagging.type = "feature";
      }
    });
  }

  // in all cases, if flag exists and false, access is denied
  if (flagging.hasFlag && !flagging.value) {
    const respValue = `disabled-by-${flagging.type}-flag` as PolicyResponse;
    const disabledByFlagResponse = {
      policy: permission,
      access: false,
      response: respValue,
      code: getPolicyResponseCode(respValue),
      // checks are needed so the aggregations in checkParents function works
      checks: [
        {
          response: respValue,
          code: getPolicyResponseCode(respValue),
          name: `Feature Flag: ${permission}`,
        },
      ],
    } as IPermissionAccessResponse;
    logResponse(disabledByFlagResponse, label);
    return disabledByFlagResponse;
  }

  // required checks - things feature flags can not override
  const requiredChecks: PermissionCheckFunction[] = [
    checkParents,
    checkServiceStatus,
    checkAuthentication,
    checkPrivileges,
    checkOwner,
    checkEdit,
    checkLicense,
    checkAssertions,
  ];

  // checks that feature flags can override
  const overridableChecks: PermissionCheckFunction[] = [
    checkAvailability,
    checkEnvironment,
  ];

  let checkFns: PermissionCheckFunction[] = [];
  // If there is a "feature" flag, set to true, for the policy
  // we just run the required checks
  if (flagging.hasFlag && flagging.value && flagging.type === "feature") {
    checkFns = [...requiredChecks];
  } else {
    // otherwise we run all the checks
    checkFns = [...overridableChecks, ...requiredChecks];
  }

  // execute the checks
  const checks = checkFns.reduce((acc: IPolicyCheck[], fn) => {
    acc = [...acc, ...fn(systemPolicy, context, entity)];
    return acc;
  }, []);

  // Default to granted
  const response: IPermissionAccessResponse = {
    policy: permission,
    access: true,
    response: "granted",
    code: getPolicyResponseCode("granted"),
    checks: [],
  };

  // For system policies, all conditions must be met, so we can
  // iterate through the checks and set the response to the first failure
  // while still returning all the checks for observability
  checks.forEach((check) => {
    if (check.response !== "granted" && response.response === "granted") {
      response.response = check.response;
      response.code = check.code;
      response.access = false;
    }
  });

  response.checks = checks;

  // Entity policies are treated as "grants" so we only need to pass one
  if (entity) {
    const entityPolicies: IEntityPermissionPolicy[] = getWithDefault(
      entity,
      "permissions",
      []
    );

    const entityPermissionPolicies = entityPolicies.filter(
      (e) => e.permission === permission
    );
    // Entity Policies are "grants" in that only one needs to pass
    // but we still want each check returned so we can see why they
    // got access or got denied
    const entityChecks = entityPermissionPolicies.map((policy) => {
      return checkEntityPolicy(policy, context);
    });
    // Process them to see if any grant access
    const grantedCheck = entityChecks.find((e) => e.response === "granted");
    // If we did not find a check that grants access, AND we've passed
    // all the system checks, then we set the response to "not-granted"
    // and set the access to false
    if (
      entityChecks.length &&
      !grantedCheck &&
      response.response === "granted"
    ) {
      response.access = false;
      response.response = "not-granted";
    }
    // Merge in the entity checks...
    response.checks = [...response.checks, ...entityChecks];
  }

  // log response
  logResponse(response, label);

  return response;
}

function logResponse(response: IPermissionAccessResponse, label: string): void {
  if (!response.access) {
    // tslint:disable-next-line:no-console
    console.info(
      `checkPermission: ${label} ${response.policy} : ${response.response}`
    );
    // tslint:disable-next-line:no-console
    console.dir(response);
    // tslint:disable-next-line:no-console
    console.info(`-----------------------------------------`);
  }
}
