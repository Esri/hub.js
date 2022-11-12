import { isSubsystem } from "../../../src/core/types/ISystemStatus";

describe("isSubsystem", () => {
  it("should return true for a valid subsystem", () => {
    expect(isSubsystem("discussions")).toBe(true);
  });

  it("should return false for an invalid subsystem", () => {
    expect(isSubsystem("discussion")).toBe(false);
  });
});
