import {
  isHubService,
  isSubsystem,
} from "../../../src/core/types/ISystemStatus";

describe("isSubsystem", () => {
  it("should return true for a valid subsystem", () => {
    expect(isSubsystem("discussions")).toBe(true);
  });

  it("should return false for an invalid subsystem", () => {
    expect(isSubsystem("discussion")).toBe(false);
  });
});

describe("isHubService", () => {
  it("should return true for a valid subsystem", () => {
    expect(isHubService("discussions")).toBe(true);
  });

  it("should return false for an invalid subsystem", () => {
    expect(isHubService("discussion")).toBe(false);
  });
});
