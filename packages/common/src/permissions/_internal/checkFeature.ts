import { IArcGISContext } from "../../ArcGISContext";
import { IPermissionPolicy, PolicyResponse, IPolicyCheck } from "../types";
import { getPolicyResponseCode } from "./getPolicyResponseCode";
import { HubEnvironment } from "../../ArcGISContext";
import { env } from "process";

const HubFeatures = ["workspaces"];

export type HubFeature = (typeof HubFeatures)[number];

// TODO: i don't think i have this right
export type IHubFeatures = Record<HubFeature, boolean>;

const QaExtFeatures: IHubFeatures = {
  workspaces: true,
};

const DevExtFeatures: IHubFeatures = { ...QaExtFeatures };
const LocalDevFeatures: IHubFeatures = { ...QaExtFeatures };
const SandboxDevFeatures: IHubFeatures = { ...QaExtFeatures };

const ProductionFeatures: IHubFeatures = {
  workspaces: false,
};

const EnterpriseFeatures: IHubFeatures = {
  workspaces: false,
};

function getFeaturesForEnvironment(environment: HubEnvironment): IHubFeatures {
  switch (environment) {
    case "qaext":
      return QaExtFeatures;
    case "devext":
      return DevExtFeatures;
    case "localdev":
      return LocalDevFeatures;
    case "sandbox":
      return SandboxDevFeatures;
    case "enterprise":
      return EnterpriseFeatures;
    default:
      // default to prod
      return ProductionFeatures;
  }
}

function getFeatures(context: IArcGISContext): IHubFeatures {
  const { environment } = context;
  const featuresForEnvironment = getFeaturesForEnvironment(environment);
  return {
    ...featuresForEnvironment,
    ...context.features,
  };
}

/**
 * Validate entityOwner policy
 * @param policy
 * @param context
 * @param entity
 * @returns
 */
export function checkFeatures(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];
  // Only return a check if the policy is defined
  if (policy.features?.length) {
    const featuresHash = getFeatures(context);
    const result: PolicyResponse = policy.features.every(
      (feature) => featuresHash[feature]
    )
      ? "granted"
      : "feature-not-available";

    // create the check
    const check: IPolicyCheck = {
      name: `features`,
      value: `required: ${policy.features.join(", ")}`,
      code: getPolicyResponseCode(result),
      response: result,
    };
    checks.push(check);
  }

  return checks;
}
