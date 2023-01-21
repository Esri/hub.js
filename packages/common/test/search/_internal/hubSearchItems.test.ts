import { IFilter, IHubSearchOptions, IPredicate, IQuery } from "../../../src";
import {
  formatFilterBlock,
  formatPredicate,
  getOgcItemQueryParams,
} from "../../../src/search/_internal/hubSearchItems";
import { UserSession } from "@esri/arcgis-rest-auth";

describe("hubSearchItems Module:", () => {
  describe("formatPredicate", () => {
    it("handles a simple predicate", () => {
      const predicate = {
        type: "typeA",
      };
      const result = formatPredicate(predicate);
      expect(result).toEqual("(type=typeA)");
    });

    it("handles a simple multi-predicate", () => {
      const predicate = {
        type: "typeA",
        tags: "tagA",
      };
      const result = formatPredicate(predicate);
      expect(result).toEqual("(type=typeA AND tags=tagA)");
    });

    it("handles a string array", () => {
      const predicate = {
        type: ["typeA", "typeB"],
      };
      const result = formatPredicate(predicate);
      expect(result).toEqual("(type IN (typeA, typeB))");
    });

    it("handles a multiple string arrays", () => {
      const predicate = {
        type: ["typeA", "typeB"],
        tags: ["tagA", "tagB"],
      };
      const result = formatPredicate(predicate);
      expect(result).toEqual(
        "(type IN (typeA, typeB) AND tags IN (tagA, tagB))"
      );
    });

    it("handles a complex predicate with anys", () => {
      const predicate = {
        type: {
          any: ["typeA", "typeB"],
        },
      };
      const result = formatPredicate(predicate);
      expect(result).toEqual("(type IN (typeA, typeB))");
    });

    it("handles a complex predicate with anys and alls", () => {
      const predicate = {
        tags: {
          any: ["tagA", "tagB"],
          all: ["tagC", "tagD"],
        },
      };
      const result = formatPredicate(predicate);
      expect(result).toEqual(
        "(tags IN (tagA, tagB) AND tags=tagC AND tags=tagD)"
      );
    });

    it("handles a complex predicate with anys, alls and nots", () => {
      const predicate = {
        tags: {
          any: ["tagA", "tagB"],
          all: ["tagC", "tagD"],
          not: ["tagE", "tagF"],
        },
      };
      const result = formatPredicate(predicate);
      expect(result).toEqual(
        "(tags IN (tagA, tagB) AND tags=tagC AND tags=tagD AND tags NOT IN (tagE, tagF))"
      );
    });

    it("handles multiple complex predicates", () => {
      const predicate = {
        tags: {
          any: ["tagA", "tagB"],
          all: ["tagC", "tagD"],
        },
        type: {
          any: ["typeA", "typeB"],
          not: ["typeC", "typeD"],
        },
      };
      const result = formatPredicate(predicate);
      expect(result).toEqual(
        "(" +
          "tags IN (tagA, tagB) AND tags=tagC AND tags=tagD" +
          " AND " +
          "type IN (typeA, typeB) AND type NOT IN (typeC, typeD)" +
          ")"
      );
    });

    it("handles all 3 kinds of predicates", () => {
      const predicate = {
        type: "typeA",
        tags: ["tagA", "tagB"],
        categories: {
          any: ["categoryA", "categoryB"],
          all: ["categoryC", "categoryD"],
          not: ["categoryE", "categoryF"],
        },
      };

      const result = formatPredicate(predicate);

      expect(result).toEqual(
        "(" +
          "type=typeA" +
          " AND " +
          "tags IN (tagA, tagB)" +
          " AND " +
          "categories IN (categoryA, categoryB) AND categories=categoryC AND categories=categoryD AND categories NOT IN (categoryE, categoryF)" +
          ")"
      );
    });
  });

  describe("formatFilterBlock", () => {
    it("ORs together predicates by default", () => {
      const predicate1: IPredicate = { type: "typeA" };
      const predicate2: IPredicate = { tags: "tagA" };
      const filter: IFilter = {
        predicates: [predicate1, predicate2],
      };

      const result = formatFilterBlock(filter);
      expect(result).toEqual("((type=typeA) OR (tags=tagA))");
    });

    it("handles when operation is OR", () => {
      const predicate1: IPredicate = { type: "typeA" };
      const predicate2: IPredicate = { tags: "tagA" };
      const filter: IFilter = {
        operation: "OR",
        predicates: [predicate1, predicate2],
      };

      const result = formatFilterBlock(filter);
      expect(result).toEqual("((type=typeA) OR (tags=tagA))");
    });

    it("handles when operation is AND", () => {
      const predicate1: IPredicate = { type: "typeA" };
      const predicate2: IPredicate = { tags: "tagA" };
      const filter: IFilter = {
        operation: "AND",
        predicates: [predicate1, predicate2],
      };

      const result = formatFilterBlock(filter);
      expect(result).toEqual("((type=typeA) AND (tags=tagA))");
    });
  });

  describe("getOgcItemQueryParams", () => {
    const query: IQuery = {
      targetEntity: "item",
      filters: [
        {
          operation: "OR",
          predicates: [{ type: "typeA" }],
        },
      ],
    };

    it("handles query", () => {
      const options: IHubSearchOptions = {};
      const result = getOgcItemQueryParams(query, options);
      expect(result).toEqual("?filter=((type=typeA))");
    });

    it("handles query and auth", () => {
      const options: IHubSearchOptions = {
        requestOptions: {
          authentication: {
            token: "abc",
          } as UserSession,
        },
      };

      const result = getOgcItemQueryParams(query, options);
      expect(result).toEqual("?filter=((type=typeA))&token=abc");
    });

    it("handles query, auth and limit", () => {
      const options: IHubSearchOptions = {
        requestOptions: {
          authentication: {
            token: "abc",
          } as UserSession,
        },
        num: 9,
      };

      const result = getOgcItemQueryParams(query, options);
      expect(result).toEqual("?filter=((type=typeA))&token=abc&limit=9");
    });

    it("handles query, auth, limit and startindex", () => {
      const options: IHubSearchOptions = {
        requestOptions: {
          authentication: {
            token: "abc",
          } as UserSession,
        },
        num: 9,
        start: 10,
      };

      const result = getOgcItemQueryParams(query, options);
      expect(result).toEqual(
        "?filter=((type=typeA))&token=abc&limit=9&startindex=10"
      );
    });
  });
});
