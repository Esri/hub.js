import { getEntityTypeFromType } from "../../../src/search/_internal/getEntityTypeFromType";

describe("getEntityTypeFromType:", () => {
  it("check return values", () => {
    expect(getEntityTypeFromType("Web Mapping Application")).toEqual(
      "item",
      "Random type returns item"
    );
    expect(getEntityTypeFromType("Group")).toEqual(
      "group",
      "Group returns group"
    );
    expect(getEntityTypeFromType("user")).toEqual(
      "user",
      "case does not matter"
    );
    expect(getEntityTypeFromType("EVENT")).toEqual(
      "event",
      "case does not matter"
    );
    expect(getEntityTypeFromType("Channel")).toEqual("channel");

    expect(getEntityTypeFromType("GROUP member")).toEqual("groupMember");
  });
});
