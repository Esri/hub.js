import { isGuid } from "../src/is-guid";

describe("isGuid", () => {
  it("works", () => {
    expect(isGuid("3e7862aa-9150-408c-9ff9-3dddd0822adf")).toBe(true);
    expect(isGuid("F1ACA0FE-AB33-496B-84B3-F63BE07CD97A")).toBe(true);
    expect(isGuid("A1295DEF67814571B99EDDEA65748148")).toBe(true);
    expect(isGuid("c90c8745f1854420b1c23e407941fd45")).toBe(true);
    expect(isGuid("{759287b4766048c19c27d001376b7d37}")).toBe(true);
    expect(isGuid("NOTAGUID")).toBe(false);
  });
});
