import { getProp } from "../../src/objects/get-prop";

describe("getProp:", () => {
  let testObj: any;
  beforeEach(() => {
    testObj = {
      color: "red",
      colors: ["red", "orange", "yellow", "blue", "green"],
      colorVals: [
        { color: "red", value: "#FF0000", cost: 100 },
        { color: "orange", value: "#FFA500", cost: 102 },
        { color: "yellow", value: "#FFFF00", cost: 40 },
      ],
      nest: {
        someBoolProp: true,
        someOtherBoolProp: false,
        nullVal: null,
      },
      properties: {
        metrics: {
          funding: {
            source: {
              type: "static-value",
              value: 1000,
            },
          },
          countyFunding: {
            $use: "properties.metrics.funding",
          },
        },
      },
    };
  });
  it("return top level property", () => {
    const c = getProp(testObj, "color");
    expect(c).toBe("red");
  });

  it("returns booleans as expected", () => {
    expect(getProp(testObj, "nest.someBoolProp")).toBe(true);
    expect(getProp(testObj, "nest.someOtherBoolProp")).toBe(false);
  });
  it("returns null values", () => {
    expect(getProp(testObj, "nest.nullVal")).toBeNull();
  });
  it("return undefined for missing top level property", () => {
    const c = getProp(testObj, "notdefined");
    expect(c).not.toBeDefined();
  });
  it("return top level property as object", () => {
    const c = getProp(testObj, "properties");
    expect(c).toEqual(testObj.properties);
  });
  it("returns deep nested object", () => {
    const c = getProp(testObj, "properties.metrics.funding");
    expect(c).toEqual(testObj.properties.metrics.funding);
  });
  it("redirects via $use", () => {
    const c = getProp(testObj, "properties.metrics.countyFunding");
    expect(c).toEqual(testObj.properties.metrics.funding);
  });
  it("returns entry in array by index", () => {
    const c = getProp(testObj, "colors[2]");
    expect(c).toEqual("yellow");
  });
  it("returns undefined for entry in array by invalid index", () => {
    const c = getProp(testObj, "colors[20]");
    expect(c).not.toBeDefined();
  });
  it("returns undefined for entry in array by invalid index", () => {
    const c = getProp(testObj, "colors[blah]");
    expect(c).not.toBeDefined();
  });
  it("returns entry in array by property string value", () => {
    const c = getProp(testObj, "colorVals[findBy(color,'orange')].cost");
    expect(c).toEqual(102);
  });
  it("returns entry in array by property number value", () => {
    const c = getProp(testObj, "colorVals[findBy(cost,102)].color");
    expect(c).toEqual("orange");
  });
  it("returns undefined for entry array by property invalid value", () => {
    const c = getProp(testObj, "colorVals[findBy(cost,199)].color");
    expect(c).not.toBeDefined();
  });
  it("returns undefined if invalid function", () => {
    const c = getProp(testObj, "colorVals[filterBy(cost,199)].color");
    expect(c).not.toBeDefined();
  });
});
