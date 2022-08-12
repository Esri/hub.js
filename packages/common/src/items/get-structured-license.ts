export interface IStructuredLicense {
  type: string;
  name?: string;
  text?: string;
  abbr?: string;
  url?: string;
}

export const STANDARD_LICENSES = [
  {
    type: "CC0-1.0",
    abbr: "CC0",
    name: "Public Domain Dedication",
    url: "https://creativecommons.org/publicdomain/zero/1.0",
  },
  {
    type: "CC-BY-4.0",
    abbr: "CC BY",
    name: "Attribution 4.0 International",
    url: "https://creativecommons.org/licenses/by/4.0",
  },
  {
    type: "CC-BY-3.0",
    abbr: "CC BY 3.0",
    name: "Attribution 3.0 Unported",
    url: "https://creativecommons.org/licenses/by/3.0",
  },
  {
    type: "CC-BY-2.5",
    abbr: "CC BY 2.5",
    name: "Attribution 2.5 Generic",
    url: "https://creativecommons.org/licenses/by/2.5",
  },
  {
    type: "CC-BY-2.0",
    abbr: "CC BY 2.0",
    name: "Attribution 2.0 Generic",
    url: "https://creativecommons.org/licenses/by/2.0",
  },
  {
    type: "CC-BY-1.0",
    abbr: "CC BY 1.0",
    name: "Attribution 1.0 Generic",
    url: "https://creativecommons.org/licenses/by/1.0",
  },
  {
    type: "CC-BY-SA-4.0",
    abbr: "CC BY-SA",
    name: "Attribution-ShareAlike 4.0 International",
    url: "https://creativecommons.org/licenses/by-sa/4.0",
  },
  {
    type: "CC-BY-SA-3.0",
    abbr: "CC BY-SA 3.0",
    name: "Attribution-ShareAlike 3.0 Unported",
    url: "https://creativecommons.org/licenses/by-sa/3.0",
  },
  {
    type: "CC-BY-SA-2.5",
    abbr: "CC BY-SA 2.5",
    name: "Attribution-ShareAlike 2.5 Generic",
    url: "https://creativecommons.org/licenses/by-sa/2.5",
  },
  {
    type: "CC-BY-SA-2.0",
    abbr: "CC BY-SA 2.0",
    name: "Attribution-ShareAlike 2.0 Generic",
    url: "https://creativecommons.org/licenses/by-sa/2.0",
  },
  {
    type: "CC-BY-SA-1.0",
    abbr: "CC BY-SA 1.0",
    name: "Attribution-ShareAlike 1.0 Generic",
    url: "https://creativecommons.org/licenses/by-sa/1.0",
  },
  {
    type: "CC-BY-ND-4.0",
    abbr: "CC BY-ND",
    name: "Attribution-NoDerivatives 4.0 International",
    url: "https://creativecommons.org/licenses/by-nd/4.0",
  },
  {
    type: "CC-BY-ND-3.0",
    abbr: "CC BY-ND 3.0",
    name: "Attribution-NoDerivs 3.0 Unported",
    url: "https://creativecommons.org/licenses/by-nd/3.0",
  },
  {
    type: "CC-BY-ND-2.5",
    abbr: "CC BY-ND 2.5",
    name: "Attribution-NoDerivs 2.5 Generic",
    url: "https://creativecommons.org/licenses/by-nd/2.5",
  },
  {
    type: "CC-BY-ND-2.0",
    abbr: "CC BY-ND 2.0",
    name: "Attribution-NoDerivs 2.0 Generic",
    url: "https://creativecommons.org/licenses/by-nd/2.0",
  },
  {
    type: "CC-BY-ND-1.0",
    abbr: "CC BY-ND 1.0",
    name: "Attribution-NoDerivs 1.0 Generic",
    url: "https://creativecommons.org/licenses/by-nd/1.0",
  },
  {
    type: "CC-BY-NC-4.0",
    abbr: "CC BY-NC",
    name: "Attribution-NonCommercial 4.0 International",
    url: "https://creativecommons.org/licenses/by-nc/4.0",
  },
  {
    type: "CC-BY-NC-3.0",
    abbr: "CC BY-NC 3.0",
    name: "Attribution-NonCommercial 3.0 Unported",
    url: "https://creativecommons.org/licenses/by-nc/3.0",
  },
  {
    type: "CC-BY-NC-2.5",
    abbr: "CC BY-NC 2.5",
    name: "Attribution-NonCommercial 2.5 Generic",
    url: "https://creativecommons.org/licenses/by-nc/2.5",
  },
  {
    type: "CC-BY-NC-2.0",
    abbr: "CC BY-NC 2.0",
    name: "Attribution-NonCommercial 2.0 Generic",
    url: "https://creativecommons.org/licenses/by-nc/2.0",
  },
  {
    type: "CC-BY-NC-1.0",
    abbr: "CC BY-NC 1.0",
    name: "Attribution-NonCommercial 1.0 Generic",
    url: "https://creativecommons.org/licenses/by-nc/1.0",
  },
  {
    type: "CC-BY-NC-SA-4.0",
    abbr: "CC BY-NC-SA",
    name: "Attribution-NonCommercial-ShareAlike 4.0 International",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0",
  },
  {
    type: "CC-BY-NC-SA-3.0",
    abbr: "CC BY-NC-SA 3.0",
    name: "Attribution-NonCommercial-ShareAlike 3.0 Unported",
    url: "https://creativecommons.org/licenses/by-nc-sa/3.0",
  },
  {
    type: "CC-BY-NC-SA-2.5",
    abbr: "CC BY-NC-SA 2.5",
    name: "Attribution-NonCommercial-ShareAlike 2.5 Generic",
    url: "https://creativecommons.org/licenses/by-nc-sa/2.5",
  },
  {
    type: "CC-BY-NC-SA-2.0",
    abbr: "CC BY-NC-SA 2.0",
    name: "Attribution-NonCommercial-ShareAlike 2.0 Generic",
    url: "https://creativecommons.org/licenses/by-nc-sa/2.0",
  },
  {
    type: "CC-BY-NC-SA-1.0",
    abbr: "CC BY-NC-SA 1.0",
    name: "Attribution-NonCommercial-ShareAlike 1.0 Generic",
    url: "https://creativecommons.org/licenses/by-nc-sa/1.0",
  },
  {
    type: "CC-BY-NC-ND-4.0",
    abbr: "CC BY-NC-ND",
    name: "Attribution-NonCommercial-NoDerivatives 4.0 International",
    url: "https://creativecommons.org/licenses/by-nc-nd/4.0",
  },
  {
    type: "CC-BY-NC-ND-3.0",
    abbr: "CC BY-NC-ND 3.0",
    name: "Attribution-NonCommercial-NoDerivs 3.0 Unported",
    url: "https://creativecommons.org/licenses/by-nc-nd/3.0",
  },
  {
    type: "CC-BY-NC-ND-2.5",
    abbr: "CC BY-NC-ND 2.5",
    name: "Attribution-NonCommercial-NoDerivs 2.5 Generic",
    url: "https://creativecommons.org/licenses/by-nc-nd/2.5",
  },
  {
    type: "CC-BY-NC-ND-2.0",
    abbr: "CC BY-NC-ND 2.0",
    name: "Attribution-NonCommercial-NoDerivs 2.0 Generic",
    url: "https://creativecommons.org/licenses/by-nc-nd/2.0",
  },
  {
    type: "CC-BY-NC-ND-1.0",
    abbr: "CC BY-NC-ND 1.0",
    name: "Attribution-NonCommercial-NoDerivs 1.0 Generic",
    url: "https://creativecommons.org/licenses/by-nc-nd/1.0",
  },
  {
    type: "PDDL-1.0",
    abbr: "PDDL",
    name: "ODC Public Domain Dedication and License",
    url: "https://opendatacommons.org/licenses/pddl/summary",
  },
  {
    type: "ODbL-1.0",
    abbr: "ODbL",
    name: "ODC Open Database License",
    url: "https://opendatacommons.org/licenses/odbl/summary",
  },
  {
    type: "ODC-BY-1.0",
    abbr: "ODC BY",
    name: "ODC Attribution License",
    url: "https://opendatacommons.org/licenses/by/summary",
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
    type: rawLicense ? "custom" : "none",
    text: rawLicense,
  };

  // (2) Check for standard licenses: If the name, abbr, or url of any standard
  // license is in the raw license text, we assume that is the license.
  let hasStandardLicense = false;
  const matchingStandardLicenses = STANDARD_LICENSES.filter(
    (standardLicense) => {
      return licenseTextContainsStandardLicenseAttributes(
        rawLicense,
        standardLicense
      );
    }
  );
  if (matchingStandardLicenses.length) {
    hasStandardLicense = true;
    structuredLicense = matchingStandardLicenses.pop();
  }

  // (3) if not a standard license, we check if the raw license is a url or link
  if (!hasStandardLicense) {
    let url;

    // a. check if the the raw license is simply a url
    if (isParseableAsURL(rawLicense)) {
      url = rawLicense;
    }
    // b. check if the raw license is simply a link (i.e. an anchor tag with an href)
    else if (isSingleAnchorWithHrefAttribute(rawLicense)) {
      const hrefRegex = new RegExp(/href\s?=\s?["'](.*?)["']/);
      const match = rawLicense.match(hrefRegex);
      const href = match[1];

      url = href;
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
 * helper function to determine if the raw license is simply a link, i.e. a single
 * anchor tag with an href attribute: <a href="https://google.com">Click</a> or <a href="https://google.com" />
 * @param rawLicense an item's raw licenseInfo string
 * @returns {boolean}
 */
function isSingleAnchorWithHrefAttribute(rawLicense: string) {
  const isSingleAnchorTagRegex = new RegExp(
    /^<a[\s]+(href\s?=\s?["'].*?["'])+([^>]?)>((?:.(?!\<\/a\>))*.)?<\/a>$|^<a[\s]+(href\s?=\s?["'].*?["'])+([^>]?)\/>/
  );

  return isSingleAnchorTagRegex.test(rawLicense);
}
