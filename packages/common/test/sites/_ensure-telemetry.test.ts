import {
  _ensureTelemetry,
  IModel,
  cloneObject,
  IDraft,
  mergeObjects,
  setProp,
  buildDraft,
} from "../../src";
import {
  draftModelOneThree,
  oneThreeSiteDraftIncludeList,
} from "../fixtures/historical-site-draft-schemas/1-3";

const siteModel = {
  item: {
    id: "3ef",
    title: "Some Site",
    type: "Hub Site",
    properties: {
      schemaVersion: 1.3,
    },
  },
  data: {
    values: {
      gacode: "UA-123456-0",
    },
  },
} as unknown as IModel;

describe("_ensure-telemetry", () => {
  describe("Site model", function () {
    let model: IModel;

    beforeEach(function () {
      model = cloneObject(siteModel);
    });

    it("deletes gacode and adds telemetry with ga enabled", function () {
      const expected: IModel = cloneObject(model);
      delete expected.data.values.gacode;
      expected.data.values.telemetry = {
        consentNotice: {
          isTheme: true,
          consentText: "",
          policyURL: "",
        },
        customAnalytics: {
          ga: {
            customerTracker: {
              enabled: true,
              id: "UA-123456-0",
            },
          },
        },
      };
      expected.item.properties.schemaVersion = 1.4;
      const results = _ensureTelemetry<IModel>(model);
      expect(results).toEqual(expected);
    });

    it("deletes gacode and adds telemetry with ga disabled", function () {
      model.data.values.gacode = "";
      const expected: IModel = cloneObject(model);
      delete expected.data.values.gacode;
      expected.data.values.telemetry = {
        consentNotice: {
          isTheme: true,
          consentText: "",
          policyURL: "",
        },
        customAnalytics: {
          ga: {
            customerTracker: {
              enabled: false,
              id: "",
            },
          },
        },
      };
      expected.item.properties.schemaVersion = 1.4;
      const results = _ensureTelemetry<IModel>(model);
      expect(results).toEqual(expected);
    });

    it("does nothing if schema >= 1.4", function () {
      model.item.properties.schemaVersion = 1.4;
      const results = _ensureTelemetry(model);
      expect(results).toEqual(model);
    });
  });

  describe("Site draft", function () {
    let model: IDraft;

    beforeEach(function () {
      model = cloneObject(draftModelOneThree);
    });

    it("deletes gacode and adds telemetry with ga enabled", function () {
      const expected: IDraft = cloneObject(model);
      delete expected.data.values.gacode;
      expected.data.values.telemetry = {
        consentNotice: {
          isTheme: true,
          consentText: "",
          policyURL: "",
        },
        customAnalytics: {
          ga: {
            customerTracker: {
              enabled: true,
              id: "UA-123456-0",
            },
          },
        },
      };
      setProp("item.properties.schemaVersion", 1.4, expected);
      const results = _ensureTelemetry<IDraft>(model);
      expect(results).toEqual(expected);
    });

    it("deletes gacode and adds telemetry with ga disabled", function () {
      model.data.values.gacode = "";
      const expected: IDraft = cloneObject(model);
      delete expected.data.values.gacode;
      expected.data.values.telemetry = {
        consentNotice: {
          isTheme: true,
          consentText: "",
          policyURL: "",
        },
        customAnalytics: {
          ga: {
            customerTracker: {
              enabled: false,
              id: "",
            },
          },
        },
      };
      setProp("item.properties.schemaVersion", 1.4, expected);
      const results = _ensureTelemetry<IDraft>(model);
      expect(results).toEqual(expected);
    });
  });

  it("can apply the draft without messing anything up", function () {
    // The include list used at schema version 1.3
    const model = cloneObject(siteModel);
    const draft = buildDraft(model, oneThreeSiteDraftIncludeList);
    const migratedModel = _ensureTelemetry<IModel>(model);
    const migratedDraft = _ensureTelemetry<IDraft>(draft);

    const draftAppliedSite = mergeObjects(
      migratedDraft,
      cloneObject(migratedModel),
      oneThreeSiteDraftIncludeList
    );

    expect(draftAppliedSite.item.properties.schemaVersion).toEqual(1.4);
    expect(draftAppliedSite.data.values.hasOwnProperty("gacode")).toBeFalsy();
    expect(draftAppliedSite.data.values.telemetry).toEqual({
      consentNotice: {
        isTheme: true,
        consentText: "",
        policyURL: "",
      },
      customAnalytics: {
        ga: {
          customerTracker: {
            enabled: true,
            id: "UA-123456-0",
          },
        },
      },
    });
  });
});
