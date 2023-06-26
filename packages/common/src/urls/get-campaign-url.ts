import { IHubRequestOptions } from "../types";
import { getPortalUrl } from "./get-portal-url";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { _getHubUrlFromPortalHostname } from "./_get-hub-url-from-portal-hostname";

interface IBuildHubCampaignUrl {
  portal: string | IPortal | IHubRequestOptions | IRequestOptions;
  uri: string;
  meta: any;
  redirectUrl: string;
}

/**
 * Builds a Hub "campaign" URL used as a single entry-point into
 * Hub from external links, i.e. push notifications, emails, sms, etc,
 * from which we can capture campaign-related telemetry before redirecting
 * the user off to a provided destination.
 * @param options.portal A string IPortal IHubRequestOptions or IRequestOptions object
 * @param options.uri A URI that provides additional context for how to parse the provide meta
 * @param options.meta An object of metadata for the campaign URL
 * @param options.redirectURL A redirect URL
 * @returns string A campaign URL
 */
export function getCampaignUrl(options: IBuildHubCampaignUrl): string {
  const { portal, ...data } = options;
  const portalUrl = getPortalUrl(portal);
  const hubURL = _getHubUrlFromPortalHostname(portalUrl);
  const url = new URL(`${hubURL}/c`);
  const b64Data = btoa(JSON.stringify(data));
  url.searchParams.set("d", b64Data);
  return url.toString();
}
