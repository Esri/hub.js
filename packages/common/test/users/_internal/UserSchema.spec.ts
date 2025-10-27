import { describe, it, expect } from "vitest";
import { UserSchema } from "../../../src/users/_internal/UserSchema";

describe("UserSchema", () => {
  it("has expected top-level properties", () => {
    expect(UserSchema).toHaveProperty("properties");
    expect(UserSchema.properties).toHaveProperty("settings");
    expect(UserSchema.properties).toHaveProperty("hubOrgSettings");
  });
});
