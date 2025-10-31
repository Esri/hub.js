import { describe, it, expect } from "vitest";
import { migrateEnsureHeaderComponentName } from "../../../src/sites/_internal/migrateEnsureHeaderComponentName";

describe("migrateEnsureHeaderComponentName", () => {
  it("adds name 'site-header' if missing on header component", () => {
    const model = {
      data: {
        values: {
          layout: {
            header: {
              component: { type: "header" },
              // name missing
            },
          },
        },
      },
    };
    const result = migrateEnsureHeaderComponentName(model as any);
    expect(result.data.values.layout.header.name).toBe("site-header");
  });

  it("does not overwrite existing header name", () => {
    const model = {
      data: {
        values: {
          layout: {
            header: {
              component: { type: "header" },
              name: "custom-header",
            },
          },
        },
      },
    };
    const result = migrateEnsureHeaderComponentName(model as any);
    expect(result.data.values.layout.header.name).toBe("custom-header");
  });

  it("does nothing if header is missing", () => {
    const model = {
      data: {
        values: {
          layout: {
            // header missing
          },
        },
      },
    };
    const result = migrateEnsureHeaderComponentName(model as any);
    expect(result.data.values.layout.header).toBeUndefined();
  });

  it("does nothing if header.component is missing", () => {
    const model = {
      data: {
        values: {
          layout: {
            header: {
              // component missing
            },
          },
        },
      },
    };
    const result = migrateEnsureHeaderComponentName(model as any);
    expect(result.data.values.layout.header.name).toBeUndefined();
  });
});
