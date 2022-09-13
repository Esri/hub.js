import { domainExists } from "../sites/domains/domain-exists";
import { IHubRequestOptions } from "../types";

const SAFE_REDIRECT_URL = new RegExp(
  "^https?:\\/\\/([a-z0-9-]+\\.)*(arcgis|esri)\\.com"
);

const HTTP_PROTOCOL = new RegExp("^https?:$");

interface IIsSafeUrlOptions extends IHubRequestOptions {
  url: string;
}

/**
 *
 * @param options url A URL
 */
export async function isSafeRedirectUrl(
  options: IIsSafeUrlOptions
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
