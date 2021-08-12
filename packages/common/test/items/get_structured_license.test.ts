import { getStructuredLicense, STANDARD_LICENSES, ETypes } from "../../src";

describe("getStructuredLicense", function () {
  describe("standard licenses", function () {
    it("rawLicense contains standard license name: returns the correct structured license", function () {
      const standardLicenseName = "Creative Commons Attribution";
      const structuredLicense = getStructuredLicense(
        `This is a standard license: ${standardLicenseName}`
      );
      const expectedStructuredLicense = STANDARD_LICENSES.find(
        (license) => license.name === standardLicenseName
      );

      expect(structuredLicense).toEqual(expectedStructuredLicense);
    });
    it("rawLicense contains standard license url: returns the correct structured license", function () {
      const standardLicenseUrl =
        "https://creativecommons.org/licenses/by-nc/4.0/";
      const structuredLicense = getStructuredLicense(
        `This is a standard license: ${standardLicenseUrl}`
      );
      const expectedStructuredLicense = STANDARD_LICENSES.find(
        (license) => license.url === standardLicenseUrl
      );

      expect(structuredLicense).toEqual(expectedStructuredLicense);
    });
    it("rawLicense contains standard license abbreviation: returns the correct structured license", function () {
      const standardLicenseAbbr = "ODbL";
      const structuredLicense = getStructuredLicense(
        `This is a standard license: ${standardLicenseAbbr}`
      );
      const expectedStructuredLicense = STANDARD_LICENSES.find(
        (license) => license.abbr === standardLicenseAbbr
      );

      expect(structuredLicense).toEqual(expectedStructuredLicense);
    });
  });

  describe("custom licenses", function () {
    it("rawLicense = simple custom text: returns the correct structured licnese", function () {
      const text = "This is a custom license";
      const structuredLicense = getStructuredLicense(text);
      const expectedStructuredLicense = {
        type: ETypes.CUSTOM,
        text,
      };
      expect(structuredLicense).toEqual(expectedStructuredLicense);
    });
    it("rawLicense = simple url: returns the correct structured license", function () {
      const url = "https://google.com";
      const structuredLicense = getStructuredLicense(url);
      const expectedStructuredLicense = {
        type: ETypes.CUSTOM,
        url,
      };
      expect(structuredLicense).toEqual(expectedStructuredLicense);
    });
    it("rawLicense = simple anchor tag with href: returns the correct structured license", function () {
      const structuredLicense = getStructuredLicense(
        '<a href="https://google.com">Click</a>'
      );
      const expectedStructuredLicense = {
        type: ETypes.CUSTOM,
        url: "https://google.com",
      };
      expect(structuredLicense).toEqual(expectedStructuredLicense);
    });
    it("rawLicense = custom license with rich markup: returns the correct structured license", function () {
      const richMarkup =
        "<div><span style='font-weight:bold;'>This is bold text.  </span><a href='https://google.com'>This is a link</a></div>";
      const structuredLicense = getStructuredLicense(richMarkup);
      const expectedStructuredLicense = {
        type: ETypes.CUSTOM,
        text: richMarkup,
      };
      expect(structuredLicense).toEqual(expectedStructuredLicense);
    });
  });

  describe("no license", function () {
    it("rawLicense = null: returns the correct structured license", function () {
      const structuredLicense = getStructuredLicense(null);
      const expectedStructuredLicense = {
        type: ETypes.NONE,
      };
      expect(structuredLicense).toEqual(expectedStructuredLicense);
    });
    it('rawLicense = "": returns the correct structured license', function () {
      const structuredLicense = getStructuredLicense("");
      const expectedStructuredLicense = {
        type: ETypes.NONE,
      };
      expect(structuredLicense).toEqual(expectedStructuredLicense);
    });
  });
});
