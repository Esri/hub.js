import { IModel } from "../../src";
import { _enforceLowercaseDomains } from "../../src/sites/_enforce-lowercase-domains";

describe("_enforceLowercaseDomains", () => {
  it("enforces lowercase domains", async () => {
    const model = {
      item: {
        properties: {
          schemaVersion: 1.0,
        },
      },
      data: {
        values: {
          subdomain: "Capitalized",
          defaultHostname: "CaPitaliZed",
          internalUrl: {}, // not a string
        },
      },
    } as unknown as IModel;

    const chk = _enforceLowercaseDomains(model);

    expect(chk.item.properties.schemaVersion).toBe(1.1, "bumped schema");
    expect(chk.data.values.subdomain).toBe("capitalized");
    expect(chk.data.values.defaultHostname).toBe("capitalized");
    expect(chk.data.values.internalUrl).toEqual({});
  });

  it("does nothing if schema >= 1.1", async () => {
    const model = {
      item: {
        properties: {
          schemaVersion: 1.1,
        },
      },
      data: {
        values: {
          subdomain: "Capitalized",
          defaultHostname: "CaPitaliZed",
          internalUrl: {}, // not a string
        },
      },
    } as unknown as IModel;

    const chk = _enforceLowercaseDomains(model);

    expect(chk).toEqual(model, "did nothing");
  });
});
