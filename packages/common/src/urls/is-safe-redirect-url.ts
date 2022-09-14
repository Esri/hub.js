import { domainExists } from "../sites/domains/domain-exists";
import { IHubRequestOptions } from "../types";

const SAFE_REDIRECT_URL = new RegExp(
  "^https?:\\/\\/([a-z0-9-]+\\.)*(arcgis|esri)\\.com"
);

const HTTP_PROTOCOL = new RegExp("^https?:$");

interface IIsSafeRedirectUrlOptions extends IHubRequestOptions {
  url: string;
}

/**
 * Determines if a given URL is safe to redirect to.
 * All URLs to *.esri.com and *.arcgis.com are considered
 * safe. Non esri/arcgis domains must have a domain record.
 * @param options.url url A URL
 * @param ...options An IHubRequestOptions object
 * @returns a promise that resolves a boolean
 */
export async function isSafeRedirectUrl(
  options: IIsSafeRedirectUrlOptions
): Promise<boolean> {
  const { url, ...hubRequestOptions } = options;
  let isSafe;
  try {
    isSafe = SAFE_REDIRECT_URL.test(url);
    if (!isSafe) {
      const { protocol, hostname } = new URL(url);
      if (!HTTP_PROTOCOL.test(protocol)) {
        throw new Error("invalid protocol");
      }
      isSafe = await domainExists(hostname, hubRequestOptions);
    }
  } catch (e) {
    isSafe = false;
  }
  return isSafe;
}
