import { EventGalleryCardSchema } from "../../../../../src/core/schemas/internal/events/EventGalleryCardSchema";
import {
  ENTITY_CATEGORIES_SCHEMA,
  ENTITY_TAGS_SCHEMA,
} from "../../../../../src/core/schemas/shared/subschemas";

describe("EventGalleryCardSchema", () => {
  it("should define the expected schema", () => {
    expect(EventGalleryCardSchema).toEqual({
      type: "object",
      properties: {
        selectionMode: {
          type: "string",
          enum: ["dynamic", "manual"],
          default: "dynamic",
        },
        entityIds: {
          type: "array",
          items: {
            type: "string",
          },
          default: [],
        },
        eventIds: {
          type: "array",
          items: {
            type: "string",
          },
          default: [],
        },
        corners: {
          type: "string",
          enum: ["square", "round"],
          default: "square",
        },
        shadow: {
          type: "string",
          enum: ["none", "low", "medium", "heavy"],
          default: "none",
        },
        showAdditionalInfo: {
          type: "boolean",
          default: true,
        },
        access: {
          type: "array",
          items: {
            type: "string",
            enum: ["private", "org", "public"],
          },
          default: [],
        },
        tags: ENTITY_TAGS_SCHEMA,
        categories: ENTITY_CATEGORIES_SCHEMA,
        titleHeading: {
          type: "string",
          enum: ["h1", "h2", "h3", "h4", "h5", "h6"],
          default: "h4",
        },
        openIn: {
          type: "string",
          enum: ["same", "new"],
          default: "same",
        },
        cardsShown: {
          type: "string",
          enum: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
          ],
          default: "4",
        },
      },
    });
  });
});
