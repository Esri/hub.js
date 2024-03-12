import { IModel } from "../../../src";
import { ensureBaseTelemetry } from "../../../src/sites/_internal/ensureBaseTelemetry";

describe("ensure base telemtry:", () => {
  it("returns model if telemetry is present", () => {
    const model: IModel = {
      data: {
        telemetry: {},
      },
    } as unknown as IModel;
    const chk = ensureBaseTelemetry(model);
    expect(chk).toBe(model);
  });

  it("returns clone with telemetry when telemetry is not present", () => {
    const model: IModel = {
      data: {},
    } as unknown as IModel;
    const chk = ensureBaseTelemetry(model);
    expect(chk).not.toBe(model);
    expect(chk?.data?.telemetry).toBeDefined();
  });
});
