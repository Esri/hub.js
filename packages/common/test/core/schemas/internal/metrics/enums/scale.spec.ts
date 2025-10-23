import { expect, it } from "vitest";
import { SCALE } from "../../../../../../src/core/schemas/internal/metrics/enums/scale";

it("SCALE enum has correct keys and values", () => {
  const keys = Object.keys(SCALE).sort();
  // enum compiled to object with values 's','m','l'
  expect(SCALE.small).toBe("s");
  expect(SCALE.medium).toBe("m");
  expect(SCALE.large).toBe("l");
  // ensure keys include the enum names
  expect(keys).toEqual(["large", "medium", "small"].sort());
});
