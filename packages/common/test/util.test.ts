import {
  cloneObject,
  getProp,
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
  concat
} from "../src/util";

describe("util functions", () => {
  it("can clone a shallow object", () => {
    const obj = {
      color: "red",
      length: 12
    } as any;
    const c = cloneObject(obj);
    expect(c).not.toBe(obj);

    ["color", "length"].map(prop => {
      expect(c[prop]).toEqual(obj[prop]);
    });
  });

  it("can clone a deep object", () => {
    const obj = {
      color: "red",
      length: 12,
      field: {
        name: "origin",
        type: "string"
      }
    } as any;
    const c = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.field).not.toBe(obj.field);

    ["color", "length"].map(prop => {
      expect(c[prop]).toEqual(obj[prop]);
    });
    ["name", "type"].map(prop => {
      expect(c.field[prop]).toEqual(obj.field[prop]);
    });
  });

  it("does not stringify null", () => {
    const obj = {
      color: "red",
      length: 12,
      field: {
        name: "origin",
        type: null
      }
    } as any;
    const c = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.field).not.toBe(obj.field);
    expect(c.field.type).toBe(null);

    ["color", "length"].map(prop => {
      expect(c[prop]).toEqual(obj[prop]);
    });
    ["name", "type"].map(prop => {
      expect(c.field[prop]).toEqual(obj.field[prop]);
    });
  });

  it("can clone a deep object with an array", () => {
    const obj = {
      color: "red",
      length: 12,
      field: {
        name: "origin",
        type: "string"
      },
      names: ["steve", "james", "bob"],
      deep: [
        {
          things: ["one", "two", "red", "blue"]
        }
      ],
      addresses: [
        {
          street: "123 main",
          city: "anytown",
          zip: 82729
        },
        {
          street: "876 main",
          city: "anytown",
          zip: 123992
        }
      ]
    } as any;

    const c = cloneObject(obj);
    expect(c).not.toBe(obj);
    expect(c.field).not.toBe(obj.field);
    expect(c.names).not.toBe(obj.names);
    expect(c.names.length).toEqual(obj.names.length);
    expect(Array.isArray(c.deep)).toBeTruthy();
    expect(c.deep[0].things.length).toBe(4);
    ["color", "length"].map(prop => {
      expect(c[prop]).toEqual(obj[prop]);
    });
    ["name", "type"].map(prop => {
      expect(c.field[prop]).toEqual(obj.field[prop]);
    });
    // deep array...
    expect(Array.isArray(c.addresses)).toBeTruthy();
    expect(c.addresses.length).toEqual(obj.addresses.length);

    c.addresses.forEach((entry: any, idx: number) => {
      const orig = obj.addresses[idx];
      expect(entry).not.toBe(orig);
      ["street", "city", "zip"].map(prop => {
        expect(entry[prop]).toBe(orig[prop]);
      });
    });
  });

  it("can clone an indicator", () => {
    const obj = {
      url:
        "https://servicesqa.arcgis.com/97KLIFOSt5CxbiRI/arcgis/rest/services/Collisions_Indicator",
      layerId: 0,
      itemId: "e05e89d83552497bba267a20ca4cea74",
      name: "Collisions_Indicator",
      fields: [
        {
          id: "numInjuries",
          field: {
            name: "MAJORINJURIES",
            alias: "MAJORINJURIES",
            type: "esriFieldTypeInteger"
          }
        }
      ]
    } as any;
    const s = cloneObject(obj);

    expect(s).not.toBe(obj);
    ["url", "layerId", "itemId", "name"].map(prop => {
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
        x: 123
      },
      {
        blarg: "bc23",
        v: "orange",
        x: 453
      }
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

  it("can get a deep property", () => {
    const obj = {
      b: {
        c: {
          d: "peekaboo"
        },
        color: "orange"
      },
      size: "small"
    } as any;
    const c = getProp(obj, "b.c.d");
    expect(c).toBe("peekaboo");
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
        color: "red"
      },
      propb: {
        color: "blue"
      },
      propc: {
        color: "green"
      }
    };
    const c = objectToArray(obj);
    expect(Array.isArray(c)).toBeTruthy();
    expect(c.length).toBe(3);

    ["propa", "propb", "propc"].forEach(prop => {
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
        id: "blue"
      },
      {
        id: "orange"
      }
    ];
    const c = findBy(data, "id", "red");
    expect(c).toBeNull();
  });

  it("findBy returns object if item in array", () => {
    const data = [
      {
        id: "blue"
      },
      {
        id: "red"
      },
      {
        id: "orange"
      }
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
            prop: "value"
          }
        }
      },
      {
        id: "red"
      },
      {
        id: "orange"
      }
    ];
    const c = findBy(data, "obj2.obj3.prop", "value");
    expect(c).toBeDefined();
    expect(c).toEqual(data[0]); // 'should return the object, not a clone');
  });

  it("compose can run", () => {
    const sqr = (x: number) => x * x;
    const inc = (x: number) => x + 1;

    expect(typeof compose).toEqual("function");
    expect(
      compose(
        sqr,
        inc
      )(2)
    ).toEqual(sqr(inc(2)));
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
        color: "red"
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
              itemId: "3ef"
            },
            fieldworker: {
              itemId: "7fe"
            }
          }
        },
        data: {
          values: {
            webmap: "3c4"
          }
        }
      };
      const props = [
        "item.id",
        "item.properties.source.itemId",
        "item.properties.fieldworker.itemId",
        "item.properties.stakeholder.itemId",
        "data.values.webmap"
      ];
      const ids = props.reduce((acc, key) => {
        return maybePush(getProp(m, key), acc);
      }, []);
      expect(ids.length).toBe(4, "should have 4 entries");
      ["bc3", "3ef", "7fe", "3c4"].forEach(k => {
        expect(ids.indexOf(k)).toBeGreaterThan(-1, `should include ${k}`);
      });
    });
  });

  describe("maybeAdd utility", () => {
    it("should append key w value", () => {
      const m = {
        prop: "val"
      };
      const chk = maybeAdd("lastName", "skywalker", m);
      expect(chk.prop).toBe("val", "should have existing vals");
      expect(chk.lastName).toBe("skywalker", "should add the new one");
    });

    it("should not append null or undefined key", () => {
      const m = {
        prop: "val"
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
        prop: "val"
      };
      const chk = maybeAdd("prop", "skywalker", m);
      expect(chk.prop).toBe("skywalker", "should add the new one");
    });

    it("should replace key w obj", () => {
      const m = {
        prop: "val"
      };
      const o = {
        color: "red"
      };
      const chk = maybeAdd("properties", o, m);
      expect(chk.prop).toBe("val", "should keep existing prop");
      expect(chk.properties).toBe(o, "should append in object");
    });

    it("should attach array as prop", () => {
      const m = {
        prop: "val"
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
            sourceId: "3ef"
          }
        },
        data: {
          theme: "orange",
          parcelLayer: {
            primaryField: "PIN"
          }
        }
      };
      const props = [
        "item.title",
        "item.description",
        "item.missingProp",
        "data.parcelLayer.primaryField"
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

  describe("concat", () => {
    it("should concatenate arrays", () => {
      const ary1 = [1, 2, 3];
      const ary2 = ["luke", "rey"];

      expect(concat(ary1, ary2)).toEqual([1, 2, 3, "luke", "rey"]);

      expect(ary1).toEqual([1, 2, 3]);
      expect(ary2).toEqual(["luke", "rey"]);

      const ary3 = [[1, 2, 3], [3, 4, 5], [1]];
      const flattened = ary3.reduce(concat, []);
      expect(flattened).toEqual([1, 2, 3, 3, 4, 5, 1]);

      expect([].reduce(concat, [])).toEqual([]);
    });
  });
});
