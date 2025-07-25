import { getCategoryTree } from "../../../../../src/core/schemas/internal/categories/getCategoryTree";

describe("getCategoryTree", () => {
  it("should build a simple category tree from a single aggregation category", () => {
    const categories = ["/categories/fruit/apple"];
    const tree = getCategoryTree(categories);
    expect(tree).toEqual({
      label: "Categories",
      value: "/categories",
      children: {
        fruit: {
          label: "Fruit", // Note: label is capitalized
          value: "/categories/fruit",
          children: {
            apple: {
              label: "Apple", // Note: label is capitalized
              value: "/categories/fruit/apple",
              children: {},
            },
          },
        },
      },
    });
  });

  it("should build a tree with multiple branches", () => {
    const categories = [
      "/categories/fruit/apple",
      "/categories/fruit/banana",
      "/categories/vegetable/carrot",
    ];
    const tree = getCategoryTree(categories);
    expect(tree).toEqual({
      label: "Categories",
      value: "/categories",
      children: {
        fruit: {
          label: "Fruit",
          value: "/categories/fruit",
          children: {
            apple: {
              label: "Apple",
              value: "/categories/fruit/apple",
              children: {},
            },
            banana: {
              label: "Banana",
              value: "/categories/fruit/banana",
              children: {},
            },
          },
        },
        vegetable: {
          label: "Vegetable",
          value: "/categories/vegetable",
          children: {
            carrot: {
              label: "Carrot",
              value: "/categories/vegetable/carrot",
              children: {},
            },
          },
        },
      },
    });
  });

  it("should throw if categories are not fully qualified", () => {
    expect(() => getCategoryTree(["fruit/apple"])).toThrow(
      new Error("Invalid categories found: fruit/apple")
    );
  });

  it("should throw if categories have mixed prefixes", () => {
    expect(() =>
      getCategoryTree(["/categories/fruit/apple", "/Categories/fruit/banana"])
    ).toThrow(
      new Error(
        "All categories must have the same prefix ('/categories/' or '/Categories/')"
      )
    );
  });

  it("should handle organization categories", () => {
    const categories = [
      "/Categories/Org/HR/Payroll",
      "/Categories/Org/HR/Benefits",
    ];
    const tree = getCategoryTree(categories);
    expect(tree).toEqual({
      label: "Categories",
      value: "/Categories",
      children: {
        Org: {
          label: "Org",
          value: "/Categories/Org",
          children: {
            HR: {
              label: "HR",
              value: "/Categories/Org/HR",
              children: {
                Payroll: {
                  label: "Payroll",
                  value: "/Categories/Org/HR/Payroll",
                  children: {},
                },
                Benefits: {
                  label: "Benefits",
                  value: "/Categories/Org/HR/Benefits",
                  children: {},
                },
              },
            },
          },
        },
      },
    });
  });

  it("should fill in missing intermediary nodes", () => {
    const categories = ["/categories/a/b/c"];
    const tree = getCategoryTree(categories);
    expect(tree).toEqual({
      label: "Categories",
      value: "/categories",
      children: {
        a: {
          label: "A",
          value: "/categories/a",
          children: {
            b: {
              label: "B",
              value: "/categories/a/b",
              children: {
                c: {
                  label: "C",
                  value: "/categories/a/b/c",
                  children: {},
                },
              },
            },
          },
        },
      },
    });
  });
});
