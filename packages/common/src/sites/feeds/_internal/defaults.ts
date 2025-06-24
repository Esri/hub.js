import { FeedFormat } from "../types";
import { RSS_2X_DEFAULT } from "./templates/rss2";
import { DCAT_US_3X_DEFAULT } from "./templates/dcatUS3";
import { DCAT_AP_2XX_DEFAULT } from "./templates/dcatAP2";
import { DCAT_AP_3X_DEFAULT } from "./templates/dcatAP3";
import { DCAT_US_1X_DEFAULT } from "./templates/dcatUS1";

/**
 * Returns the default templates for each supported major version of each feed format
 */
export function getDefaultTemplates(): Record<FeedFormat, Record<string, any>> {
  return {
    "dcat-us": {
      "1": DCAT_US_1X_DEFAULT,
      "3": DCAT_US_3X_DEFAULT,
    },
    "dcat-ap": {
      "2": DCAT_AP_2XX_DEFAULT,
      "3": DCAT_AP_3X_DEFAULT,
    },
    rss: {
      "2": RSS_2X_DEFAULT,
    },
  };
}
