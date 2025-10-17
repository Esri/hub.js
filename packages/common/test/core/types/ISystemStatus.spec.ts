import { isHubService } from "../../../src/core/types/ISystemStatus";

describe("isHubService", () => {
  it("should return true for a valid subsystem", () => {
    expect(isHubService("discussions")).toBe(true);
  });

  it("should return false for an invalid subsystem", () => {
    expect(isHubService("discussion")).toBe(false);
  });
});
