import { IArcGISContext } from "../../ArcGISContext";
import { PolicyResponse } from "../types";
import { IPermissionPolicy } from "../types/IPermissionPolicy";
import { IPolicyCheck } from "../types/IPolicyCheck";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

export function checkServiceStatus(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  _entity?: Record<string, any>
): IPolicyCheck[] {
  let checks = [] as IPolicyCheck[];
  if (policy.services) {
    const services = context.serviceStatus;
    // we need each service to have a status of "online"
    // and if not, return status info
    checks = policy.services.map((service) => {
      let result: PolicyResponse = "granted";
      if (services[service] !== "online") {
        result = `service-${services[service]}` as PolicyResponse;
      }

      const check: IPolicyCheck = {
        name: `service ${service} online`,
        value: `service is ${services[service]}`,
        code: getPolicyResponseCode(result),
        response: result,
      };
      return check;
    });
  }

  return checks;
}
