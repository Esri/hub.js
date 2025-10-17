import { deepDeletePropByValue } from "../../src/objects/deepDeletePropByValue";
describe("deepDeletePropByValue: ", () => {
  it("removes string from array", () => {
    const test = ["remove-me", "keep-me"];
    const chk = deepDeletePropByValue(test, "remove-me");
    expect(chk.length).toBe(1);
    expect(chk).toEqual(["keep-me"]);
  });
  it("removes objects from arrays", () => {
    const test = [{ a: "b" }, { c: "d" }];
    const chk = deepDeletePropByValue(test, { a: "b" });
    expect(chk.length).toBe(1);
    expect(chk).toEqual([{ c: "d" }]);
  });
  it("removes objects from deep.arrays", () => {
    const test = { p: [{ a: "b" }, { c: "d" }] };
    const chk = deepDeletePropByValue(test, { a: "b" });
    expect(chk.p.length).toBe(1);
    expect(chk).toEqual({ p: [{ c: "d" }] });
  });

  it("returns undefined if value matches string", () => {
    const test = "remove-me";

    const chk = deepDeletePropByValue(test, "remove-me");
    expect(chk).toBe(undefined);
  });
  it("returns undefined if value matches object", () => {
    const test = { a: "b" };

    const chk = deepDeletePropByValue(test, { a: "b" });
    expect(chk).toBe(undefined);
  });
  it("remove object prop if value matches", () => {
    const test = { p: { a: "b" }, q: { a: "c" } };

    const chk = deepDeletePropByValue(test, { a: "b" });
    expect(chk).toEqual({ q: { a: "c" } });
  });
  it("delete prop from object", () => {
    const test = {
      prop: "remove-me",
      other: "keep-me",
    };
    const chk = deepDeletePropByValue(test, "remove-me");
    expect(chk).toEqual({ other: "keep-me" });
  });
  it("delete deep prop from object", () => {
    const test = {
      prop: "value1",
      obj2: {
        prop: "value2",
        obj3: {
          prop: "value3",
          obj4: {
            prop: "remove-me",
            other: "prop",
          },
        },
      },
    };
    const chk = deepDeletePropByValue(test, "remove-me");
    expect(chk).toEqual({
      prop: "value1",
      obj2: {
        prop: "value2",
        obj3: {
          prop: "value3",
          obj4: {
            other: "prop",
          },
        },
      },
    });
  });
  it("ignores function props", () => {
    const test = {
      f: () => {
        return "remove-me";
      },
      p: "remove-me",
    };
    const chk = deepDeletePropByValue(test, "remove-me");
    expect(typeof chk.f).toEqual("function");
  });
  it("ignores functions", () => {
    const test = () => {
      return "remove-me";
    };
    const chk = deepDeletePropByValue(test, "remove-me");
    expect(typeof chk).toEqual("function");
  });
  it("ignores dates", () => {
    const chk = deepDeletePropByValue({ d: new Date() }, "remove-me");
    expect(chk.d instanceof Date).toBe(true);
  });
});
