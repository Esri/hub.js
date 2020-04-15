/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { cloneObject, IInitiativeModel } from "@esri/hub-common";
import { createInitiativeModelFromTemplate } from "../src/templates";

const defaultTemplate = {
  item: {
    id: "3ef-the-template-id",
    title: "template title",
    description: "template desc",
    snippet: "template snippet",
    url: "https://some-url.com",
    owner: "jeffvader",
    tags: ["template", "tags"],
    type: "Hub Initiative",
    typeKeywords: ["hubInitiativeTemplate", "anotherKeyword"],
    created_at: 12345,
    modified_at: 26351,
    properties: {
      aprop: "that should be removed"
    }
  },
  data: {
    assets: ["things", "that should be cloned forward"],
    steps: ["steps", "should be cloned"],
    recommendedTemplates: ["bc3", "cc4"],
    values: {
      bannerImage: { should: "also be cloned" }
    }
  }
} as IInitiativeModel;

describe("Initiative Templates ::", () => {
  describe("createInitiativeModelFromTemplate", () => {
    it("should return a new model with properties applied", () => {
      const tmpl = cloneObject(defaultTemplate) as IInitiativeModel;
      const opts = {
        title: "Death Star Initiative",
        initiativeKey: "deathStarInitiative",
        groupIds: {
          collaborationGroupId: "bc45251",
          contentGroupId: "bc45252"
        }
      };
      const chk = createInitiativeModelFromTemplate(tmpl, opts);

      expect(chk).not.toBe(tmpl, "should not return the same object");
      expect(chk.item.title).toBe(opts.title, "should use title");
      expect(chk.item.properties.source).toBe(
        defaultTemplate.item.id,
        "templateId should be source"
      );
      expect(chk.data.source).toBe(
        defaultTemplate.item.id,
        "templateId should be source"
      );
      expect(chk.item.properties.collaborationGroupId).toBe(
        opts.groupIds.collaborationGroupId
      );
      expect(chk.item.properties.contentGroupId).toBe(
        opts.groupIds.contentGroupId
      );
      expect(chk.data.values.collaborationGroupId).toBe(
        opts.groupIds.collaborationGroupId
      ); // TODO remove
      expect(chk.data.values.contentGroupId).toBe(opts.groupIds.contentGroupId); // TODO remove
      expect(chk.item.properties.initialParent).toBe(defaultTemplate.item.id);
      expect(chk.data.recommendedTemplates.length).toEqual(2);
      expect(chk.item.tags).toContain("Hub Initiative");
      expect(chk.item.typeKeywords).toContain("hubInitiative");
      expect(chk.item.typeKeywords).not.toContain("hubInitiativeTemplate");
      ["id", "owner", "created_at", "modified_at"].forEach(prop => {
        expect(chk.item[prop]).not.toBeDefined(
          `item.${prop} should not be defined on`
        );
      });
      expect(chk.data.indicators).toBeDefined();
      expect(chk.data.values.initiativeKey).toBe(opts.initiativeKey);
    });
    it("should return a new model with groupIds excluded", () => {
      const tmpl = cloneObject(defaultTemplate) as IInitiativeModel;
      const opts = {
        title: "Death Star Initiative",
        initiativeKey: "deathStarInitiative"
      };
      const chk = createInitiativeModelFromTemplate(tmpl, opts);

      expect(chk.item.properties.collaborationGroupId).toBeUndefined();
      expect(chk.item.properties.contentGroupId).toBeUndefined();
      expect(chk.data.values.collaborationGroupId).toBeUndefined(); // TODO remove this and next 4 lines
      expect(chk.data.values.contentGroupId).toBeUndefined();
      expect(chk.data.values.collaborationGroupId).toBeUndefined();
      expect(chk.data.values.contentGroupId).toBeUndefined();
    });
    it("should inject a default banner image", () => {
      const tmpl = cloneObject(defaultTemplate) as IInitiativeModel;
      delete tmpl.data.values.bannerImage;
      const opts = {
        title: "Death Star Initiative",
        initiativeKey: "deathStarInitiative"
      };
      const chk = createInitiativeModelFromTemplate(tmpl, opts);
      expect(chk.data.values.bannerImage).toBeDefined();
    });
  });
});
