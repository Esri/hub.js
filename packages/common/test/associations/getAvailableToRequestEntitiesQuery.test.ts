import { getAvailableToRequestEntitiesQuery } from "../../src/associations/getAvailableToRequestEntitiesQuery";
import { MOCK_CHILD_ENTITY, MOCK_PARENT_ENTITY } from "./fixtures";

describe("getAvailableToRequestEntitiesQuery:", () => {
  it("returns a valid IQuery for a parent entity", () => {
    const query = getAvailableToRequestEntitiesQuery(
      MOCK_PARENT_ENTITY,
      "project"
    );

    expect(query).toEqual({
      targetEntity: "item",
      filters: [
        {
          predicates: [{ group: { not: ["group-00a"], any: [], all: [] } }],
        },
        {
          predicates: [{ type: ["Hub Project"] }],
        },
      ],
    });
  });
  it("returns a valid IQuery for a child entity", () => {
    const query = getAvailableToRequestEntitiesQuery(
      MOCK_CHILD_ENTITY,
      "initiative"
    );

    expect(query).toEqual({
      targetEntity: "item",
      filters: [
        {
          operation: "AND",
          predicates: [
            {
              type: ["Hub Initiative"],
              id: { not: ["parent-00a"] },
            },
          ],
        },
      ],
    });
  });
  it("throws an error if the association is not supported", async () => {
    try {
      await getAvailableToRequestEntitiesQuery(MOCK_PARENT_ENTITY, "group");
    } catch (err) {
      expect(err).toEqual(
        new Error(
          "getAvailableToRequestEntitiesQuery: Association between initiative and group is not supported."
        )
      );
    }
  });
});
