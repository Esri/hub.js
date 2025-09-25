import {
  cloneObject,
  arrayToObject,
  objectToArray,
  findBy,
  without,
  compose,
  camelize,
  createId,
  maybeAdd,
  maybePush,
  unique,
  extend,
  addDays,
  chunkArray,
  uniqueBy,
  last,
  filterBy,
  capitalize,
  flattenArray,
  isNil,
} from "../src/util";
import { getProp } from "../src/objects/get-prop";
import { describe, it, expect } from "vitest";

type TestObj = {
  color: string;
  length: number;
  startDate?: Date;
  field?: { name: string; type: string | null };
  names?: string[];
  deep?: { things: string[] }[];
  addresses?: { street: string; city: string; zip: number }[];
};

describe("util functions", () => {
  it("can clone a shallow object", () => {
    const obj: TestObj = { color: "red", length: 12, startDate: new Date() };
    const c = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.color).toBe(obj.color);
    expect(c.length).toBe(obj.length);
    expect(c.startDate).toEqual(obj.startDate);
    expect(c.startDate).not.toBe(obj.startDate);
  });

  it("can clone a deep object", () => {
    const obj: TestObj = {
      color: "red",
      length: 12,
      field: { name: "origin", type: "string" },
    };
    const c = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.field).not.toBe(obj.field);
    expect(c.color).toBe(obj.color);
    expect(c.length).toBe(obj.length);
    expect(c.field?.name).toBe(obj.field?.name);
    expect(c.field?.type).toBe(obj.field?.type);
  });

  it("does not stringify null", () => {
    const obj: TestObj = {
      color: "red",
      length: 12,
      field: { name: "origin", type: null as string | null },
    };
    const c = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.field).not.toBe(obj.field);
    expect(c.field?.type).toBe(null);
    expect(c.color).toBe(obj.color);
    expect(c.length).toBe(obj.length);
    expect(c.field?.name).toBe(obj.field?.name);
    expect(c.field?.type).toBe(obj.field?.type);
  });

  it("handles nulls in arrays", () => {
    const obj: Array<null> = [null, null, null];
    const chk: Array<null> = cloneObject(obj);
    expect(chk).toEqual(obj);
  });

  it("handles nulls in arrays nested in objects", () => {
    const obj: { values: Array<null> } = { values: [null, null, null] };
    const chk: { values: Array<null> } = cloneObject(obj);
    expect(chk).toEqual(obj);
  });

  it("can clone a deep object with an array", () => {
    const obj: TestObj = {
      color: "red",
      length: 12,
      field: { name: "origin", type: "string" },
      names: ["steve", "james", "bob"],
      deep: [{ things: ["one", "two", "red", "blue"] }],
      addresses: [
        { street: "123 main", city: "anytown", zip: 82729 },
        { street: "876 main", city: "anytown", zip: 123992 },
      ],
    };
    const c = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.field).not.toBe(obj.field);
    expect(c.names).not.toBe(obj.names);
    expect(c.names?.length).toBe(obj.names?.length);
    expect(Array.isArray(c.deep)).toBeTruthy();
    expect(c.deep?.[0].things.length).toBe(4);
    expect(c.color).toBe(obj.color);
    expect(c.length).toBe(obj.length);
    expect(c.field?.name).toBe(obj.field?.name);
    expect(c.field?.type).toBe(obj.field?.type);
    expect(Array.isArray(c.addresses)).toBeTruthy();
    expect(c.addresses?.length).toBe(obj.addresses?.length);
    c.addresses?.forEach((entry, idx) => {
      const orig = obj.addresses?.[idx];
      expect(entry).not.toBe(orig);
      expect(entry.street).toBe(orig?.street);
      expect(entry.city).toBe(orig?.city);
      expect(entry.zip).toBe(orig?.zip);
    });
  });

  it("can clone an indicator", () => {
    const obj = {
      url: "https://servicesqa.arcgis.com/97KLIFOSt5CxbiRI/arcgis/rest/services/Collisions_Indicator",
      layerId: 0,
      itemId: "e05e89d83552497bba267a20ca4cea74",
      name: "Collisions_Indicator",
      fields: [
        {
          id: "numInjuries",
          field: {
            name: "MAJORINJURIES",
            alias: "MAJORINJURIES",
            type: "esriFieldTypeInteger",
          },
        },
      ],
    };
    const s = cloneObject(obj);
    expect(s).not.toBe(obj);
    expect(s.url).toBe(obj.url);
    expect(s.layerId).toBe(obj.layerId);
    expect(s.itemId).toBe(obj.itemId);
    expect(s.name).toBe(obj.name);
    expect(s.fields.length).toBe(obj.fields.length);
    expect(s.fields[0]).not.toBe(obj.fields[0]);
  });

  it("skips inherited property (else branch of hasOwnProperty)", () => {
    const proto = { foo: "bar" };
    const obj = Object.create(proto); // obj has 'foo' only on prototype
    const c = cloneObject(obj);
    // 'foo' should not be copied, as hasOwnProperty returns false
    expect(c.foo).toBeUndefined();
    // But proto.foo is still accessible
    expect(Object.getPrototypeOf(obj).foo).toBe("bar");
  });

  it("can convert an array to an object", () => {
    type BlargObj = { blarg: string; v: string; x: number };
    const a: BlargObj[] = [
      { blarg: "edf", v: "red", x: 123 },
      { blarg: "bc23", v: "orange", x: 453 },
    ];
    const c = arrayToObject(a, "blarg") as Record<string, BlargObj>;
    expect(Array.isArray(c)).toBeFalsy();
    expect(c["edf"]).toBeDefined();
    expect(c["edf"].v).toBe("red");
    expect(c["edf"].x).toBe(123);
    expect(c["bc23"]).toBeDefined();
    expect(c["bc23"].v).toBe("orange");
    expect(c["bc23"].x).toBe(453);
  });

  it("can convert empty object to empty array", () => {
    const c = objectToArray({});
    expect(Array.isArray(c)).toBeTruthy();
    expect(c.length).toBe(0);
  });

  it("can convert empty object to empty array with a non-default key", () => {
    const c = objectToArray({}, "notId");
    expect(Array.isArray(c)).toBeTruthy();
    expect(c.length).toBe(0);
  });

  it("can convert object to array", () => {
    type ColorObj = { color: string; id?: string };
    const obj: Record<string, ColorObj> = {
      propa: { color: "red" },
      propb: { color: "blue" },
      propc: { color: "green" },
    };
    const c = objectToArray(obj) as ColorObj[];
    expect(Array.isArray(c)).toBeTruthy();
    expect(c.length).toBe(3);
    ["propa", "propb", "propc"].forEach((prop) => {
      const chk = c.find((entry: ColorObj) => entry.id === prop);
      expect(chk).toBeDefined();
    });
  });

  it("can clone a Blob (mocked)", () => {
    // Mock Blob if not present
    class MockBlob {
      public type: string;
      public data: unknown[];
      constructor(parts: unknown[], options?: { type?: string }) {
        this.data = parts;
        this.type = options?.type ?? "";
      }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.Blob = globalThis.Blob || MockBlob;

    const obj = {
      color: "red",
      length: 12,
      field: {
        name: "origin",
        type: "string",
        csvFile: new Blob(["foo"], { type: "csv" }),
      },
    };
    const c = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.field).not.toBe(obj.field);
    expect(c.field.csvFile).not.toBe(obj.field.csvFile);
    expect(c.field.csvFile.type).toBe("csv");
    // Clean up
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (globalThis.Blob === MockBlob) delete globalThis.Blob;
  });

  it("findBy returns null if empty array", () => {
    const c = findBy([], "id", "red");
    expect(c).toBeNull();
  });

  it("findBy returns null if item not in array", () => {
    const data = [{ id: "blue" }, { id: "orange" }];
    const c = findBy(data, "id", "red");
    expect(c).toBeNull();
  });

  it("findBy returns object if item in array", () => {
    const data = [{ id: "blue" }, { id: "red" }, { id: "orange" }];
    const c = findBy(data, "id", "red");
    expect(c).toBeDefined();
    expect(c).toEqual(data[1]);
  });

  it("findBy returns null when nothing is passed", () => {
    const c = findBy(null as unknown as Array<{ id: string }>, "id", "red");
    expect(c).toBeNull();
  });

  it("findBy can deep-dot into a structure", () => {
    const data = [
      { id: "blue", obj2: { obj3: { prop: "value" } } },
      { id: "red" },
      { id: "orange" },
    ];
    const c = findBy(data, "obj2.obj3.prop", "value");
    expect(c).toBeDefined();
    expect(c).toEqual(data[0]);
  });

  it("compose can run", () => {
    const sqr = (x: number) => x * x;
    const inc = (x: number): number => x + 1;
    expect(typeof compose).toBe("function");
    expect(compose(sqr, inc)(2)).toBe(sqr(inc(2)));
    expect(null).toBeNull();
  });

  describe("without", () => {
    it("returns array of strings without an entry", () => {
      const d = ["one", "two", "three"];
      const chk = without(d, "two");
      expect(chk).not.toBe(d);
      expect(chk.length).toBe(2);
      expect(chk.indexOf("one")).toBeGreaterThan(-1);
      expect(chk.indexOf("three")).toBeGreaterThan(-1);
    });
    it("returns array without an object", () => {
      const d = [{ name: "Vader" }, { name: "Luke" }, { name: "Leia" }];
      const chk = without(d, d[2]);
      expect(chk).not.toBe(d);
      expect(chk.length).toBe(2);
    });
  });

  describe("camelize", () => {
    it("should camelCase strings", () => {
      expect(camelize("boba fett")).toBe("bobaFett");
      expect(camelize("This Should Be Ok")).toBe("thisShouldBeOk");
      expect(camelize("This-Should-Be-Ok")).toBe("thisShouldBeOk");
      expect(camelize("-This-Should-Be-Ok")).toBe("thisShouldBeOk");
      expect(camelize("This-Should-Be-Ok-")).toBe("thisShouldBeOk");
      expect(camelize("This-{}-Should-&!@#^*!-Be-Ok-")).toBe("thisShouldBeOk");
      expect(camelize("131 DELETE ME")).toBe("131DeleteMe");
    });
  });

  describe("createId", () => {
    it("should default a prefix to i", () => {
      expect(createId().substr(0, 1)).toBe("i");
      expect(createId("other").substr(0, 5)).toBe("other");
    });
  });

  describe("maybePush utility", () => {
    it("should push a value into an array", () => {
      const chk = maybePush("two", ["one"]);
      expect(chk.length).toBe(2);
      expect(chk[0]).toBe("one");
      expect(chk[1]).toBe("two");
    });
    it("should push an object into an array", () => {
      const o = { color: "red" };
      const chk = maybePush(o, []);
      expect(chk.length).toBe(1);
      expect((chk[0] as { color: string }).color).toBe("red");
      expect(chk[0]).toBe(o);
    });
    it("should not push null", () => {
      const chk = maybePush(null, ["one"]);
      expect(chk.length).toBe(1);
      expect(chk[0]).toBe("one");
    });
    it("should not push undefined", () => {
      const chk = maybePush(undefined, ["one"]);
      expect(chk.length).toBe(1);
      expect(chk[0]).toBe("one");
    });
    it("deep object test", () => {
      const m = {
        item: {
          id: "bc3",
          properties: {
            source: { itemId: "3ef" },
            fieldworker: { itemId: "7fe" },
          },
        },
        data: { values: { webmap: "3c4" } },
      };
      const props = [
        "item.id",
        "item.properties.source.itemId",
        "item.properties.fieldworker.itemId",
        "item.properties.stakeholder.itemId",
        "data.values.webmap",
      ];
      const ids = props.reduce<string[]>((acc, key) => {
        return maybePush(getProp(m, key), acc);
      }, []);
      expect(ids.length).toBe(4);
      ["bc3", "3ef", "7fe", "3c4"].forEach((k) => {
        expect(ids.indexOf(k)).toBeGreaterThan(-1);
      });
    });
  });

  describe("maybeAdd utility", () => {
    it("should append key w value", () => {
      const m = { prop: "val" };
      const chk = maybeAdd("lastName", "skywalker", m) as {
        prop: string;
        lastName?: string;
      };
      expect(chk.prop).toBe("val");
      expect(chk.lastName).toBe("skywalker");
    });
    it("should not append null or undefined key", () => {
      const m = { prop: "val" };
      const chk = maybeAdd("lastName", null, m) as {
        prop: string;
        lastName?: string;
      };
      expect(chk.prop).toBe("val");
      expect(chk.lastName).toBeUndefined();
      const chk2 = maybeAdd("lastName", undefined, m) as {
        prop: string;
        lastName?: string;
      };
      expect(chk2.prop).toBe("val");
      expect(chk2.lastName).toBeUndefined();
    });
    it("should replace key w value", () => {
      const m = { prop: "val" };
      const chk = maybeAdd("prop", "skywalker", m) as { prop: string };
      expect(chk.prop).toBe("skywalker");
    });
    it("should replace key w obj", () => {
      const m = { prop: "val" };
      const o = { color: "red" };
      const chk = maybeAdd("properties", o, m) as {
        prop: string;
        properties?: { color: string };
      };
      expect(chk.prop).toBe("val");
      expect(chk.properties).toBe(o);
    });
    it("should attach array as prop", () => {
      const m = { prop: "val" };
      const a = ["this", "is", "arry"];
      const chk = maybeAdd("arr", a, m) as { prop: string; arr?: string[] };
      expect(chk.prop).toBe("val");
      expect(chk.arr).toBe(a);
    });
    it("deep object into object test", () => {
      const m = {
        item: {
          title: "some example object",
          description: "this is some longer text",
          type: "Web Map",
          properties: { sourceId: "3ef" },
        },
        data: { theme: "orange", parcelLayer: { primaryField: "PIN" } },
      };
      const props = [
        "item.title",
        "item.description",
        "item.missingProp",
        "data.parcelLayer.primaryField",
      ];
      const chk = props.reduce<{ [key: string]: any }>((acc, key) => {
        const propName = key.split(".").reverse()[0];
        return maybeAdd(propName, getProp(m, key), acc);
      }, {});
      expect(chk.title).toBe(m.item.title);
      expect(chk.description).toBe(m.item.description);
      expect(chk.primaryField).toBe(m.data.parcelLayer.primaryField);
      expect(chk.missingProp).not.toBeDefined();
    });
  });

  describe("unique", () => {
    it("should yield unique values", () => {
      expect([1, 2, 2, 2, 3, 4, 5, 1].filter(unique)).toEqual([1, 2, 3, 4, 5]);
      expect([1, 2, 3, 4, 5].filter(unique)).toEqual([1, 2, 3, 4, 5]);
      expect(["foo", "foo", "foo"].filter(unique)).toEqual(["foo"]);
      expect(["foo"].filter(unique)).toEqual(["foo"]);
      expect(["foo", "bar", "foo"].filter(unique)).toEqual(["foo", "bar"]);
      expect([].filter(unique)).toEqual([]);
    });
  });

  describe("extend", () => {
    it("should extend an object", () => {
      const target = { a: 1 };
      const source = { a: "foo", b: "bar" };
      const result = extend(target, source);
      expect(result).toEqual({ a: "foo", b: "bar" });
    });
    it("should ignore null and undefined values", () => {
      const target = { a: 1, b: 2, c: 3 };
      const source: any = { a: undefined, b: null, c: 58 };
      const result = extend(target, source);
      expect(result).toEqual({ a: 1, b: 2, c: 58 });
    });
    it("should shallow extend a deep object", () => {
      const target = { a: 1, b: { c: 3 } };
      const source = { a: "foo", b: { d: 5 } };
      const result = extend(target, source, false);
      expect(result).toEqual({ a: "foo", b: { d: 5 } });
    });
    it("should deep extend a deep object", () => {
      const target = { a: 1, b: { c: 3 } };
      const source = { a: "foo", b: { d: 5 } };
      const result = extend(target, source);
      expect(result).toEqual({ a: "foo", b: { c: 3, d: 5 } });
    });
    it("should shallow extend an object with an array", () => {
      const target = { a: [1, 2, 3], b: { c: 3 } };
      const source = { a: [4, 5, 6], b: { d: [6, 7, 8] } };
      const result = extend(target, source, false);
      expect(result).toEqual({ a: [4, 5, 6], b: { d: [6, 7, 8] } });
    });
    it("should return a new instance", () => {
      const target = { a: 1 };
      const source = { a: 3 };
      const result = extend(target, source);
      expect(result == target).toBeFalsy();
      expect(result == source).toBeFalsy();
    });
    it("should deep extend a complex object", () => {
      const fun = function () {};
      const target = {
        a: 1,
        b: [2, 3],
        c: {
          d: 4,
          e: [5, 6],
          f: {
            g: 7,
            h: function () {},
            i: [9, 10],
          },
        },
        k: 58,
      };
      const source: any = {
        a: "1",
        c: {
          d: "4",
          e: [12, 13],
          f: {
            g: ["11", "12"],
            h: 8,
            i: [9, 10],
            j: fun,
            l: null,
          },
          r: { o: 3 },
        },
        k: undefined,
      };
      const expected = {
        a: "1",
        b: [2, 3],
        c: {
          d: "4",
          e: [12, 13],
          f: {
            g: ["11", "12"],
            h: 8,
            i: [9, 10],
            j: fun,
          },
          r: { o: 3 },
        },
        k: 58,
      };
      const result = extend(target, source);
      expect(result).toEqual(expected);
    });
  });

  describe("addDays", () => {
    it("should add days to the given date", () => {
      expect(addDays("2019-10-30", 1)).toBe("2019-10-31");
      expect(addDays("2019-12-31", 1)).toBe("2020-01-01");
    });
    it("should throw error if date is invalid", () => {
      expect(() => addDays("hello", 1)).toThrow("Invalid Date");
    });
  });

  describe("chunkArray", () => {
    it("should chunk array based on size", () => {
      expect(chunkArray([1, 2, 3, 4, 5], 3)).toEqual([
        [1, 2, 3],
        [4, 5],
      ]);
      expect(chunkArray([], 3)).toEqual([]);
    });
  });

  describe("last", () => {
    it("returns last element of an array", () => {
      expect(last([1, 2, 3])).toBe(3);
      const objArr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      expect(last(objArr)).toBe(objArr[2]);
      expect(last([])).toBeUndefined();
    });
  });

  describe("filterBy", () => {
    it("filters array by deep prop value", () => {
      const arr = [
        { item: { type: "Map", id: "map1" } },
        { item: { type: "App", id: "app1" } },
        { item: { type: "Map", id: "map2" } },
        { item: { type: "App", id: "app2" } },
      ];
      const apps = filterBy(arr, "item.type", "App");
      expect(apps.length).toBe(2);
      apps.forEach((app) => {
        expect(app.item.type).toBe("App");
      });
    });
  });

  describe("uniqueBy", () => {
    it("returns unique entries by deep prop", () => {
      const arr = [
        { item: { type: "Map", id: "map1" } },
        { item: { type: "App", id: "app1" } },
        { item: { type: "Map", id: "map1" } },
        { item: { type: "App", id: "app2" } },
      ];
      const chk = uniqueBy(arr, "item.id");
      expect(chk.length).toBe(3);
    });
  });

  describe("capitalize", () => {
    it("capitalizes the first letter", () => {
      expect(capitalize("foo")).toBe("Foo");
      expect(capitalize("bar")).toBe("Bar");
    });
    it("returns empty string unchanged", () => {
      expect(capitalize("")).toBe("");
    });
    it("handles single character", () => {
      expect(capitalize("a")).toBe("A");
    });
  });

  describe("flattenArray", () => {
    it("flattens nested arrays", () => {
      expect(
        flattenArray([
          [1, 2],
          [3, 4],
        ])
      ).toEqual([1, 2, 3, 4]);
      expect(flattenArray([[1], [2], [3]])).toEqual([1, 2, 3]);
    });
    it("returns empty array for empty input", () => {
      expect(flattenArray([])).toEqual([]);
    });
    it("flattens arrays with empty subarrays", () => {
      expect(flattenArray([[], [1], []])).toEqual([1]);
    });
  });

  it("can clone a shallow object", () => {
    const obj = { color: "red", length: 12, startDate: new Date() };
    const c = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.color).toBe(obj.color);
    expect(c.length).toBe(obj.length);
    expect(c.startDate).toEqual(obj.startDate);
    expect(c.startDate).not.toBe(obj.startDate);
  });

  it("can clone a deep object", () => {
    const obj = {
      color: "red",
      length: 12,
      field: { name: "origin", type: "string" },
    };
    const c = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.field).not.toBe(obj.field);
    expect(c.color).toBe(obj.color);
    expect(c.length).toBe(obj.length);
    expect(c.field.name).toBe(obj.field.name);
    expect(c.field.type).toBe(obj.field.type);
  });

  it("does not stringify null", () => {
    const obj = {
      color: "red",
      length: 12,
      field: { name: "origin", type: null },
    } as any;
    const c = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.field).not.toBe(obj.field);
    expect(c.field.type).toBe(null);
    expect(c.color).toBe(obj.color);
    expect(c.length).toBe(obj.length);
    expect(c.field.name).toBe(obj.field.name);
    expect(c.field.type).toBe(obj.field.type);
  });

  it("handles nulls in arrays", () => {
    const obj: Array<null> = [null, null, null];
    const chk: Array<null> = cloneObject(obj);
    expect(chk).toEqual(obj);
  });

  it("handles nulls in arrays nested in objects", () => {
    const obj: { values: Array<null> } = { values: [null, null, null] };
    const chk: { values: Array<null> } = cloneObject(obj);
    expect(chk).toEqual(obj);
  });

  it("can clone a deep object with an array", () => {
    type DeepObj = {
      color: string;
      length: number;
      field: { name: string; type: string };
      names: string[];
      deep: { things: string[] }[];
      addresses: { street: string; city: string; zip: number }[];
    };
    const obj: DeepObj = {
      color: "red",
      length: 12,
      field: { name: "origin", type: "string" },
      names: ["steve", "james", "bob"],
      deep: [{ things: ["one", "two", "red", "blue"] }],
      addresses: [
        { street: "123 main", city: "anytown", zip: 82729 },
        { street: "876 main", city: "anytown", zip: 123992 },
      ],
    };
    const c: DeepObj = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.field).not.toBe(obj.field);
    expect(c.names).not.toBe(obj.names);
    expect(c.names.length).toBe(obj.names.length);
    expect(Array.isArray(c.deep)).toBeTruthy();
    expect(c.deep[0].things.length).toBe(4);
    expect(c.color).toBe(obj.color);
    expect(c.length).toBe(obj.length);
    expect(c.field.name).toBe(obj.field.name);
    expect(c.field.type).toBe(obj.field.type);
    expect(Array.isArray(c.addresses)).toBeTruthy();
    expect(c.addresses.length).toBe(obj.addresses.length);
    c.addresses.forEach((entry, idx) => {
      const orig = obj.addresses[idx];
      expect(entry).not.toBe(orig);
      expect(entry.street).toBe(orig.street);
      expect(entry.city).toBe(orig.city);
      expect(entry.zip).toBe(orig.zip);
    });
  });

  it("can clone an indicator", () => {
    type Indicator = {
      url: string;
      layerId: number;
      itemId: string;
      name: string;
      fields: Array<{
        id: string;
        field: {
          name: string;
          alias: string;
          type: string;
        };
      }>;
    };
    const obj: Indicator = {
      url: "https://servicesqa.arcgis.com/97KLIFOSt5CxbiRI/arcgis/rest/services/Collisions_Indicator",
      layerId: 0,
      itemId: "e05e89d83552497bba267a20ca4cea74",
      name: "Collisions_Indicator",
      fields: [
        {
          id: "numInjuries",
          field: {
            name: "MAJORINJURIES",
            alias: "MAJORINJURIES",
            type: "esriFieldTypeInteger",
          },
        },
      ],
    };
    const s: Indicator = cloneObject(obj);
    expect(s).not.toBe(obj);
    expect(s.url).toBe(obj.url);
    expect(s.layerId).toBe(obj.layerId);
    expect(s.itemId).toBe(obj.itemId);
    expect(s.name).toBe(obj.name);
    expect(s.fields.length).toBe(obj.fields.length);
    expect(s.fields[0]).not.toBe(obj.fields[0]);
  });
  describe("isNil", () => {
    it("is truthy when null", () => {
      expect(isNil(null)).toBeTruthy();
    });
    it("is truthy when undefined", () => {
      expect(isNil(undefined)).toBeTruthy();
    });
    it("is falsy when 0", () => {
      expect(isNil(0)).toBeFalsy();
    });
  });
  // ...existing code...
});
