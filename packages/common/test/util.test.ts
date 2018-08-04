import {
  cloneObject,
  getProp,
  arrayToObject,
  objectToArray,
  findBy,
  compose
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

  it("can clone a deep object with an array", () => {
    const obj = {
      color: "red",
      length: 12,
      field: {
        name: "origin",
        type: "string"
      },
      names: ["steve", "james", "bob"],
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
});
