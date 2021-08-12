import { parse, validate } from "fast-xml-parser";

export interface IStructuredLicense {
  type: string;
  name?: string;
  text?: string;
  abbr?: string;
  url?: string;
}

export enum ETypes {
  NONE = "none",
  CUSTOM = "custom",
  CC0 = "CC0-1.0",
  CC_BY = "CC-BY-4.0",
  CC_BY_SA = "CC-BY-SA-4.0",
  CC_BY_ND = "CC-BY-ND-4.0",
  CC_BY_NC = "CC-BY-NC-4.0",
  CC_BY_NC_SA = "CC-BY-NC-SA-4.0",
  CC_BY_NC_ND = "CC-BY-NC-ND-4.0",
  PDDL = "PDDL-1.0",
  ODbL = "ODbl-1.0",
  ODC_BY = "ODC-BY-1.0",
}

export enum EAbbreviations {
  CC0 = "CC0",
  CC_BY = "CC BY",
  CC_BY_SA = "CC BY-SA",
  CC_BY_ND = "CC BY-ND",
  CC_BY_NC = "CC BY-NC",
  CC_BY_NC_SA = "CC BY-NC-SA",
  CC_BY_NC_ND = "CC BY-NC-ND",
  PDDL = "PDDL",
  ODbL = "ODbL",
  ODC_BY = "ODC BY",
}

export const STANDARD_LICENSES = [
  {
    type: ETypes.CC0,
    name: "Creative Commons Zero",
    abbr: EAbbreviations.CC0,
    url: "http://creativecommons.org/publicdomain/zero/1.0/",
  },
  {
    type: ETypes.CC_BY,
    name: "Creative Commons Attribution",
    abbr: EAbbreviations.CC_BY,
    url: "http://creativecommons.org/licenses/by/4.0/",
  },
  {
    type: ETypes.CC_BY_SA,
    name: "Creative Commons Share Alike",
    abbr: EAbbreviations.CC_BY_SA,
    url: "http://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    type: ETypes.CC_BY_ND,
    name: "Creative Commons Attribution-NoDerivatives",
    abbr: EAbbreviations.CC_BY_ND,
    url: "http://creativecommons.org/licenses/by-nd/4.0/",
  },
  {
    type: ETypes.CC_BY_NC,
    name: "Creative Commons Attribution-NonCommercial",
    abbr: EAbbreviations.CC_BY_NC,
    url: "https://creativecommons.org/licenses/by-nc/4.0/",
  },
  {
    type: ETypes.CC_BY_NC_SA,
    name: "Creative Commons Attribution-NonCommercial-ShareAlike",
    abbr: EAbbreviations.CC_BY_NC_SA,
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  {
    type: ETypes.CC_BY_NC_ND,
    name: "Creative Commons Attribution-NonCommercial-NoDerivatives",
    abbr: EAbbreviations.CC_BY_NC_ND,
    url: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
  },
  {
    type: ETypes.PDDL,
    name: "ODC Public Domain Dedication and License",
    abbr: EAbbreviations.PDDL,
    url: "http://opendatacommons.org/licenses/pddl/summary/",
  },
  {
    type: ETypes.ODbL,
    name: "ODC Open Database License",
    abbr: EAbbreviations.ODbL,
    url: "http://opendatacommons.org/licenses/odbl/summary/",
  },
  {
    type: ETypes.ODC_BY,
    name: "ODC Attribution License",
    abbr: EAbbreviations.ODC_BY,
    url: "https://opendatacommons.org/licenses/by/summary/",
  },
];

/**
 * generates the structured license of an item based on its
 * configured "licenseInfo"
 * @param rawLicense an item's raw licenseInfo string
 * @returns {IStructuredLicense}
 */
export function getStructuredLicense(rawLicense: string) {
  let structuredLicense: IStructuredLicense;
  rawLicense = rawLicense || "";

  // (1) start by assuming it's either a custom license, or, if there's no
  // raw license, then there's no license at all
  structuredLicense = {
    type: rawLicense ? ETypes.CUSTOM : ETypes.NONE,
    text: rawLicense,
  };

  // (2) Check for standard licenses: If the name of any standard
  // license is in the raw license text, we assume that is the license.
  let hasStandardLicense = false;
  STANDARD_LICENSES.forEach((standardLicense) => {
    if (
      licenseTextContainsStandardLicenseAttributes(rawLicense, standardLicense)
    ) {
      hasStandardLicense = true;
      structuredLicense = standardLicense;
    }
  });

  // (3) if not a standard license, we check if the raw license is a url or link
  if (!hasStandardLicense) {
    const parsedLicense = parse(rawLicense, { ignoreAttributes: false });
    let url;

    // a. check if the the raw license is simply a url
    if (isParseableAsURL(rawLicense)) {
      url = rawLicense;
    }
    // b. check if the raw license is simply a link (i.e. an anchor tag with an href)
    else if (isSingleAnchorWithHrefAttribute(rawLicense, parsedLicense)) {
      url = parsedLicense.a["@_href"];
    }

    if (url) {
      structuredLicense.url = url;
      structuredLicense.text = "";
    }
  }

  if (!structuredLicense.text) delete structuredLicense.text;

  return structuredLicense;
}

/**
 * helper function to determine if a raw license is one of the standard licenses.
 * We say it is if the raw license includes the name, url or abbreviation of the
 * standard license
 * @param rawLicense an item's raw licenseInfo string
 * @param standardLicense one of the standard licenses
 * @returns {boolean}
 */
function licenseTextContainsStandardLicenseAttributes(
  rawLicense: string,
  standardLicense: IStructuredLicense
) {
  rawLicense = rawLicense.toLowerCase();

  return (
    rawLicense.includes(standardLicense.name.toLowerCase()) ||
    rawLicense.includes(standardLicense.url.toLowerCase()) ||
    rawLicense.includes(standardLicense.abbr.toLowerCase())
  );
}

/**
 * helper function to determine if an input string can be parsed
 * as a URL with a protocol
 * @param value string to check
 * @returns {boolean}
 */
function isParseableAsURL(value: string) {
  try {
    const url = new URL(value);

    return !!url.protocol;
  } catch (err) {
    // just return fals if the URL couldn't be parsed
    return false;
  }
}

/**
 * helper function to determine if input xml is simply a link, i.e. a single
 * anchor tag with an href attribute: <a href="https://google.com">Click</a>
 * @param rawXml
 * @param parsedXml
 * @returns {boolean}
 */
function isSingleAnchorWithHrefAttribute(rawXml: string, parsedXml: any) {
  return !!(
    rawXml.trim().startsWith("<a") &&
    Object.keys(parsedXml).length === 1 &&
    Object.keys(parsedXml)[0] === "a" &&
    parsedXml.a["@_href"]
  );
}
