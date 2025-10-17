import { getMajorVersion } from "../../../../src/sites/feeds/_internal/getMajorVersion";

describe("getMajorVersion", () => {
  it("should return the major version for a standard semantic version", () => {
    const version = "1.2.3";
    const result = getMajorVersion(version);
    expect(result).toBe("1");
  });

  it("should return the major version for a version with only major and minor", () => {
    const version = "2.5";
    const result = getMajorVersion(version);
    expect(result).toBe("2");
  });

  it("should return the major version for a version with only major", () => {
    const version = "3";
    const result = getMajorVersion(version);
    expect(result).toBe("3");
  });

  it("should return the major version for a version with pre-release and build metadata", () => {
    const version = "4.0.0-alpha+001";
    const result = getMajorVersion(version);
    expect(result).toBe("4");
  });

  it("should return the major version for a version with leading zeros", () => {
    const version = "05.6.7";
    const result = getMajorVersion(version);
    expect(result).toBe("05");
  });

  it("should return the major version for a version with extra dots", () => {
    const version = "6.7.8.9";
    const result = getMajorVersion(version);
    expect(result).toBe("6");
  });

  it("should return an empty string for an empty version string", () => {
    const version = "";
    const result = getMajorVersion(version);
    expect(result).toBe("");
  });

  it("should return the major version for a version with non-numeric characters", () => {
    const version = "v7.8.9";
    const result = getMajorVersion(version);
    expect(result).toBe("v7");
  });
});
