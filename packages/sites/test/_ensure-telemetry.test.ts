import { _ensureTelemetry } from "../src";
import { IModel, cloneObject } from "@esri/hub-common";

describe("_ensure-telemetry", () => {
  let model: IModel;

  beforeEach(function() {
    model = ({
      item: {
        id: "3ef",
        properties: {
          schemaVersion: 1.3
        }
      },
      data: {
        values: {
          gacode: "UA-123456-0"
        }
      }
    } as unknown) as IModel;
  });

  it("deletes gacode and adds telemetry with ga enabled", function() {
    const expected: IModel = cloneObject(model);
    delete expected.data.values.gacode;
    expected.data.values.telemetry = {
      consentNotice: {
        isTheme: true,
        consentText: "",
        policyURL: ""
      },
      customAnalytics: {
        ga: [
          {
            enabled: true,
            id: "UA-123456-0",
            name: "customerTracker"
          }
        ]
      }
    };
    expected.item.properties.schemaVersion = 1.4;
    const results = _ensureTelemetry(model);
    expect(results).toEqual(expected);
  });

  it("deletes gacode and adds telemetry with ga disabled", function() {
    model.data.values.gacode = "";
    const expected: IModel = cloneObject(model);
    delete expected.data.values.gacode;
    expected.data.values.telemetry = {
      consentNotice: {
        isTheme: true,
        consentText: "",
        policyURL: ""
      },
      customAnalytics: {
        ga: [
          {
            enabled: false,
            id: "",
            name: "customerTracker"
          }
        ]
      }
    };
    expected.item.properties.schemaVersion = 1.4;
    const results = _ensureTelemetry(model);
    expect(results).toEqual(expected);
  });

  it("does nothing if schema >= 1.4", function() {
    model.item.properties.schemaVersion = 1.4;
    const results = _ensureTelemetry(model);
    expect(results).toEqual(model);
  });
});
