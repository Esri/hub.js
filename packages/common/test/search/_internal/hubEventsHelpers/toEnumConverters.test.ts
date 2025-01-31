import {
  EventAccess,
  EventAssociationEntityType,
  EventSortOrder,
} from "../../../../src/events/api";
import {
  toEnum,
  toEnums,
} from "../../../../src/search/_internal/hubEventsHelpers/toEnumConverters";

describe("toEnumConverters", () => {
  describe("toEnum", () => {
    it("should convert a string to a mixed case enum", () => {
      expect(
        toEnum("Hub Site Application", EventAssociationEntityType)
      ).toEqual(EventAssociationEntityType.Hub_Site_Application);
    });

    it("should convert a string to a lowercase enum regardless of case", () => {
      expect(toEnum("asc", EventSortOrder)).toEqual(EventSortOrder.asc);
      expect(toEnum("ASC", EventSortOrder)).toEqual(EventSortOrder.asc);
    });

    it("should convert a string to an uppercase enum regardless of case", () => {
      expect(toEnum("private", EventAccess)).toEqual(EventAccess.PRIVATE);
      expect(toEnum("PRIVATE", EventAccess)).toEqual(EventAccess.PRIVATE);
    });

    it("should return original value if string is not a key in the enum", () => {
      expect(toEnum("unknown", EventAccess)).toEqual("unknown");
    });
  });

  describe("toEnums", () => {
    it("should convert an array of strings to an array of enums", () => {
      expect(toEnums(["PUBLIC", "ORG"], EventAccess)).toEqual([
        EventAccess.PUBLIC,
        EventAccess.ORG,
      ]);
    });
    it("should not change original values if string is not a key in the enum", () => {
      expect(toEnums(["PUBLIC", "ORG", "unknown"], EventAccess)).toEqual([
        EventAccess.PUBLIC,
        EventAccess.ORG,
        "unknown" as EventAccess,
      ]);
    });
  });
});
