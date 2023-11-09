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
  isNil,
} from "../src/util";

import { getProp } from "../src/objects";

describe("util functions", () => {
  it("can clone a shallow object", () => {
    const obj = {
      color: "red",
      length: 12,
      startDate: new Date(),
    } as any;
    const c = cloneObject(obj);
    expect(c).not.toBe(obj);

    ["color", "length", "startDate"].map((prop) => {
      expect(c[prop]).toEqual(obj[prop]);
    });
    // should have created a new Date object
    expect(c.startDate).not.toBe(obj.startDate);
  });

  it("can clone a deep object", () => {
    const obj = {
      color: "red",
      length: 12,
      field: {
        name: "origin",
        type: "string",
      },
    } as any;
    const c = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.field).not.toBe(obj.field);

    ["color", "length"].map((prop) => {
      expect(c[prop]).toEqual(obj[prop]);
    });
    ["name", "type"].map((prop) => {
      expect(c.field[prop]).toEqual(obj.field[prop]);
    });
  });

  it("does not stringify null", () => {
    const obj = {
      color: "red",
      length: 12,
      field: {
        name: "origin",
        type: null,
      },
    } as any;
    const c = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.field).not.toBe(obj.field);
    expect(c.field.type).toBe(null);

    ["color", "length"].map((prop) => {
      expect(c[prop]).toEqual(obj[prop]);
    });
    ["name", "type"].map((prop) => {
      expect(c.field[prop]).toEqual(obj.field[prop]);
    });
  });

  it("handles nulls in arrays", () => {
    const obj: any[] = [null, null, null];
    const chk = cloneObject(obj);
    expect(chk).toEqual(obj);
  });
  it("handles nulls in arrays nested in objects", () => {
    const obj: { values: any[] } = { values: [null, null, null] };
    const chk = cloneObject(obj);
    expect(chk).toEqual(obj);
  });

  if (typeof Blob !== "undefined") {
    it("can clone a Blob", () => {
      const obj = {
        color: "red",
        length: 12,
        field: {
          name: "origin",
          type: "string",
          csvFile: new Blob(["foo"], { type: "csv" }),
        },
      } as any;
      const c = cloneObject(obj);
      expect(c).not.toBe(obj);
      expect(c.field).not.toBe(obj.field);

      ["color", "length"].map((prop) => {
        expect(c[prop]).toEqual(obj[prop]);
      });
      ["name", "type", "csvFile"].map((prop) => {
        expect(c.field[prop]).toEqual(obj.field[prop]);
      });
    });
  }

  it("can clone a deep object with an array", () => {
    const obj = {
      color: "red",
      length: 12,
      field: {
        name: "origin",
        type: "string",
      },
      names: ["steve", "james", "bob"],
      deep: [
        {
          things: ["one", "two", "red", "blue"],
        },
      ],
      addresses: [
        {
          street: "123 main",
          city: "anytown",
          zip: 82729,
        },
        {
          street: "876 main",
          city: "anytown",
          zip: 123992,
        },
      ],
    } as any;

    const c = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.field).not.toBe(obj.field);
    expect(c.names).not.toBe(obj.names);
    expect(c.names.length).toEqual(obj.names.length);
    expect(Array.isArray(c.deep)).toBeTruthy();
    expect(c.deep[0].things.length).toBe(4);
    ["color", "length"].map((prop) => {
      expect(c[prop]).toEqual(obj[prop]);
    });
    ["name", "type"].map((prop) => {
      expect(c.field[prop]).toEqual(obj.field[prop]);
    });
    // deep array...
    expect(Array.isArray(c.addresses)).toBeTruthy();
    expect(c.addresses.length).toEqual(obj.addresses.length);

    c.addresses.forEach((entry: any, idx: number) => {
      const orig = obj.addresses[idx];
      expect(entry).not.toBe(orig);
      ["street", "city", "zip"].map((prop) => {
        expect(entry[prop]).toBe(orig[prop]);
      });
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
    } as any;
    const s = cloneObject(obj);

    expect(s).not.toBe(obj);
    ["url", "layerId", "itemId", "name"].map((prop) => {
      expect(s[prop]).toEqual(obj[prop]);
    });
    // now check fields...
    expect(s.fields.length).toEqual(obj.fields.length);
    expect(s.fields[0]).not.toBe(obj.fields[0]);
  });

  it("can convert an array to an object", () => {
    const a = [
      {
        blarg: "edf",
        v: "red",
        x: 123,
      },
      {
        blarg: "bc23",
        v: "orange",
        x: 453,
      },
    ];
    const c = arrayToObject(a, "blarg");
    expect(Array.isArray(c)).toBeFalsy();
    expect(c.edf).toBeDefined();
    expect(c.edf.v).toBe("red");
    expect(c.edf.x).toBe(123);
    expect(c.bc23).toBeDefined();
    expect(c.bc23.v).toBe("orange");
    expect(c.bc23.x).toBe(453);
  });

  it("can convert empty object to empty array", () => {
    const c = objectToArray({});
    expect(Array.isArray(c)).toBeTruthy();
    expect(c.length).toEqual(0);
  });

  it("can convert empty object to empty array with a non-default key", () => {
    const c = objectToArray({}, "notId");
    expect(Array.isArray(c)).toBeTruthy();
    expect(c.length).toEqual(0);
  });

  it("can convert object to array", () => {
    const obj = {
      propa: {
        color: "red",
      },
      propb: {
        color: "blue",
      },
      propc: {
        color: "green",
      },
    };
    const c = objectToArray(obj);
    expect(Array.isArray(c)).toBeTruthy();
    expect(c.length).toBe(3);

    ["propa", "propb", "propc"].forEach((prop) => {
      const chk = c.reduce((acc, entry) => {
        if (entry.id === prop) {
          acc = entry;
        }
        return acc;
      }, null);
      expect(chk).toBeDefined();
    });
  });

  it("findBy returns null if empty array", () => {
    const c = findBy([], "id", "red");
    expect(c).toBeNull();
  });

  it("findBy returns null if item not in array", () => {
    const data = [
      {
        id: "blue",
      },
      {
        id: "orange",
      },
    ];
    const c = findBy(data, "id", "red");
    expect(c).toBeNull();
  });

  it("findBy returns object if item in array", () => {
    const data = [
      {
        id: "blue",
      },
      {
        id: "red",
      },
      {
        id: "orange",
      },
    ];
    const c = findBy(data, "id", "red");
    expect(c).toBeDefined();
    expect(c).toEqual(data[1]);
  });

  it("findBy returns null when nothing is passed", () => {
    const c = findBy(null, "id", "red");
    expect(c).toBeNull();
  });

  it("findBy can deep-dot into a structure", () => {
    const data = [
      {
        id: "blue",
        obj2: {
          obj3: {
            prop: "value",
          },
        },
      },
      {
        id: "red",
      },
      {
        id: "orange",
      },
    ];
    const c = findBy(data, "obj2.obj3.prop", "value");
    expect(c).toBeDefined();
    expect(c).toEqual(data[0]); // 'should return the object, not a clone');
  });

  it("compose can run", () => {
    const sqr = (x: number) => x * x;
    const inc = (x: number) => x + 1;

    expect(typeof compose).toEqual("function");
    expect(compose(sqr, inc)(2)).toEqual(sqr(inc(2)));
    expect(null).toBeNull();
  });
  describe("without ::", () => {
    it("returns array of strings without an entry", () => {
      const d = ["one", "two", "three"];
      const chk = without(d, "two");
      expect(chk).not.toBe(d, "should return a new array");
      expect(chk.length).toEqual(2, "should have two entries");
      expect(chk.indexOf("one")).toBeGreaterThan(-1, 'should have "one"');
      expect(chk.indexOf("three")).toBeGreaterThan(-1, 'should have "three"');
    });
    it("returns array without an object", () => {
      const d = [{ name: "Vader" }, { name: "Luke" }, { name: "Leia" }];
      const chk = without(d, d[2]);
      expect(chk).not.toBe(d, "should return a new array");
      expect(chk.length).toEqual(2, "should have two entries");
    });
  });

  describe("camelize", () => {
    it("should camelCase strings", () => {
      expect(camelize("boba fett")).toEqual("bobaFett");
      expect(camelize("This Should Be Ok")).toEqual("thisShouldBeOk");
      expect(camelize("This-Should-Be-Ok")).toEqual("thisShouldBeOk");
      expect(camelize("-This-Should-Be-Ok")).toEqual("thisShouldBeOk");
      expect(camelize("This-Should-Be-Ok-")).toEqual("thisShouldBeOk");
      expect(camelize("This-{}-Should-&!@#^*!-Be-Ok-")).toEqual(
        "thisShouldBeOk"
      );
      expect(camelize("131 DELETE ME")).toEqual("131DeleteMe");
    });
  });

  describe("createId", () => {
    it("should default a prefix to i", () => {
      expect(createId().substr(0, 1)).toBe(
        "i",
        "should start with i by default"
      );
      expect(createId("other").substr(0, 5)).toBe(
        "other",
        "should append a prefix"
      );
    });
  });

  describe("maybePush utility", () => {
    it("should push a value into an array", () => {
      const chk = maybePush("two", ["one"]);
      expect(chk.length).toBe(2, "should add the value");
      expect(chk[0]).toBe("one", "should have the original value");
      expect(chk[1]).toBe("two", "should have the new value");
    });

    it("should push an object into an array", () => {
      const o = {
        color: "red",
      };
      const chk = maybePush(o, []);
      expect(chk.length).toBe(1, "should add the value");
      expect(chk[0].color).toBe("red", "should add the value");
      expect(chk[0]).toBe(o, "should push the actual value in");
    });

    it("should not push null", () => {
      const chk = maybePush(null, ["one"]);
      expect(chk.length).toBe(1, "should add the value");
      expect(chk[0]).toBe("one", "should have the original value");
    });

    it("should not push undefined", () => {
      const chk = maybePush(undefined, ["one"]);
      expect(chk.length).toBe(1, "should add the value");
      expect(chk[0]).toBe("one", "should have the original value");
    });
    it("deep object test", () => {
      const m = {
        item: {
          id: "bc3",
          properties: {
            source: {
              itemId: "3ef",
            },
            fieldworker: {
              itemId: "7fe",
            },
          },
        },
        data: {
          values: {
            webmap: "3c4",
          },
        },
      };
      const props = [
        "item.id",
        "item.properties.source.itemId",
        "item.properties.fieldworker.itemId",
        "item.properties.stakeholder.itemId",
        "data.values.webmap",
      ];
      const ids = props.reduce((acc, key) => {
        return maybePush(getProp(m, key), acc);
      }, []);
      expect(ids.length).toBe(4, "should have 4 entries");
      ["bc3", "3ef", "7fe", "3c4"].forEach((k) => {
        expect(ids.indexOf(k)).toBeGreaterThan(-1, `should include ${k}`);
      });
    });
  });

  describe("maybeAdd utility", () => {
    it("should append key w value", () => {
      const m = {
        prop: "val",
      };
      const chk = maybeAdd("lastName", "skywalker", m);
      expect(chk.prop).toBe("val", "should have existing vals");
      expect(chk.lastName).toBe("skywalker", "should add the new one");
    });

    it("should not append null or undefined key", () => {
      const m = {
        prop: "val",
      };
      const chk = maybeAdd("lastName", null, m);
      expect(chk.prop).toBe("val", "should have existing vals");
      expect(chk.lastName).toBeUndefined("should not add");
      const chk2 = maybeAdd("lastName", undefined, m);
      expect(chk2.prop).toBe("val", "should have existing vals");
      expect(chk2.lastName).toBeUndefined("should not add");
    });

    it("should replace key w value", () => {
      const m = {
        prop: "val",
      };
      const chk = maybeAdd("prop", "skywalker", m);
      expect(chk.prop).toBe("skywalker", "should add the new one");
    });

    it("should replace key w obj", () => {
      const m = {
        prop: "val",
      };
      const o = {
        color: "red",
      };
      const chk = maybeAdd("properties", o, m);
      expect(chk.prop).toBe("val", "should keep existing prop");
      expect(chk.properties).toBe(o, "should append in object");
    });

    it("should attach array as prop", () => {
      const m = {
        prop: "val",
      };
      const a = ["this", "is", "arry"];
      const chk = maybeAdd("arr", a, m);
      expect(chk.prop).toBe("val", "should keep existing prop");
      expect(chk.arr).toBe(a, "should append in array");
    });

    it("deep object into object test", () => {
      const m = {
        item: {
          title: "some example object",
          description: "this is some longer text",
          type: "Web Map",
          properties: {
            sourceId: "3ef",
          },
        },
        data: {
          theme: "orange",
          parcelLayer: {
            primaryField: "PIN",
          },
        },
      };
      const props = [
        "item.title",
        "item.description",
        "item.missingProp",
        "data.parcelLayer.primaryField",
      ];
      const chk = props.reduce((acc, key) => {
        const propName = key.split(".").reverse()[0];
        return maybeAdd(propName, getProp(m, key), acc);
      }, {}) as any;

      expect(chk.title).toBe(m.item.title, "should have title");
      expect(chk.description).toBe(
        m.item.description,
        "should have description"
      );
      expect(chk.primaryField).toBe(
        m.data.parcelLayer.primaryField,
        "should have primaryField"
      );
      expect(chk.missingProp).not.toBeDefined(
        "missing prop should not be defined"
      );
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

  /* tslint:disable */
  describe("extend", () => {
    it("should extend an object", () => {
      const target = {
        a: 1,
      };
      const source = {
        a: "foo",
        b: "bar",
      };
      const result = extend(target, source);
      expect(result).toEqual({ a: "foo", b: "bar" });
    });
    it("should ignore null and undefined values", () => {
      const target = {
        a: 1,
        b: 2,
        c: 3,
      };
      const source: any = {
        a: undefined,
        b: null,
        c: 58,
      };
      const result = extend(target, source);
      expect(result).toEqual({ a: 1, b: 2, c: 58 });
    });
    it("should shallow extend a deep object", () => {
      const target = {
        a: 1,
        b: {
          c: 3,
        },
      };
      const source = {
        a: "foo",
        b: {
          d: 5,
        },
      };
      const result = extend(target, source, false);
      expect(result).toEqual({ a: "foo", b: { d: 5 } });
    });
    it("should deep extend a deep object", () => {
      const target = {
        a: 1,
        b: {
          c: 3,
        },
      };
      const source = {
        a: "foo",
        b: {
          d: 5,
        },
      };
      const result = extend(target, source);
      expect(result).toEqual({ a: "foo", b: { c: 3, d: 5 } });
    });
    it("should shallow extend an object with an array", () => {
      const target = {
        a: [1, 2, 3],
        b: {
          c: 3,
        },
      };
      const source = {
        a: [4, 5, 6],
        b: {
          d: [6, 7, 8],
        },
      };
      const result = extend(target, source, false);
      expect(result).toEqual({ a: [4, 5, 6], b: { d: [6, 7, 8] } });
    });
    it("should return a new instance", () => {
      const target = {
        a: 1,
      };
      const source = {
        a: 3,
      };
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
          r: {
            o: 3,
          },
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
          r: {
            o: 3,
          },
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
      try {
        addDays("hello", 1);
      } catch (e) {
        expect(e.message).toBe("Invalid Date");
      }
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
  describe("last: ", () => {
    it("returns last element of an array", () => {
      expect(last([1, 2, 3])).toBe(3, "should return last entry");
      const objArr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      expect(last(objArr)).toBe(objArr[2], "returns last object from an array");
      expect(last([])).toBeUndefined();
    });
  });
  describe("filterBy:", () => {
    it("filters array by deep prop value", () => {
      const arr = [
        { item: { type: "Map", id: "map1" } },
        { item: { type: "App", id: "app1" } },
        { item: { type: "Map", id: "map2" } },
        { item: { type: "App", id: "app2" } },
      ];
      const apps = filterBy(arr, "item.type", "App");
      expect(apps.length).toBe(2, "should have two apps");
      apps.forEach((app) => {
        expect(app.item.type).toBe("App");
      });
    });
  });

  describe("uniqueBy: ", () => {
    it("returns uniqu entries by deep prop", () => {
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
});
