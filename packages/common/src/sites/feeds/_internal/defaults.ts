import { FeedFormat } from "../types";
import { DCAT_US_1X_DEFAULT, DCAT_US_3X_DEFAULT } from "./templates/dcatUS";
import { DCAT_AP_2XX_DEFAULT } from "./templates/dcatAP";
import { RSS_2X_DEFAULT } from "./templates/rss";

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
    },
    rss: {
      "2": RSS_2X_DEFAULT,
    },
  };
}
