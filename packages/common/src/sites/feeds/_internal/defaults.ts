import { FeedFormat } from "../types";

/**
 * Returns the default templates for each supported major version of each feed format
 */
export function getDefaultTemplates(): Record<FeedFormat, Record<string, any>> {
  return {
    "dcat-us": {
      "1": DCAT_US_1X_DEFAULT,
    },
    "dcat-ap": {
      "2": DCAT_AP_2XX_DEFAULT,
    },
    rss: {
      "2": RSS_2X_DEFAULT,
    },
  };
}

const DCAT_US_1X_DEFAULT = {
  title: "{{name}}",
  description: "{{description}}",
  keyword: "{{tags}}",
  issued: "{{created:toISO}}",
  modified: "{{modified:toISO}}",
  publisher: {
    name: "{{source}}",
  },
  contactPoint: {
    fn: "{{owner}}",
    hasEmail: "{{orgContactEmail}}",
  },
  spatial: "{{extent}}",
};

const DCAT_AP_2XX_DEFAULT = {
  "dct:title": "{{name}}",
  "dct:description": "{{description}}",
  "dcat:contactPoint": {
    "vcard:fn": "{{owner}}",
    "vcard:hasEmail": "{{orgContactEmail}}",
  },
};

const RSS_2X_DEFAULT = {
  channel: {
    title: "{{name}}",
    description: "{{searchDescription}}",
    link: "{{siteUrl}}",
    language: "{{culture}}",
    category: "{{categories}}",
    item: {
      title: "{{name}}",
      description: "{{searchDescription}}",
      author: "{{orgContactEmail}}",
      category: "{{categories}}",
      pubDate: "{{created:toUTC}}",
    },
  },
};
