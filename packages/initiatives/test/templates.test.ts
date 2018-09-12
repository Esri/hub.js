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
        collaborationGroupId: "bc45251",
        openDataGroupId: "bc45251",
        initiativeKey: "deathStarInitiative"
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
      expect(chk.item.properties.groupId).toBe(opts.collaborationGroupId);
      expect(chk.item.properties.openDataGroupId).toBe(opts.openDataGroupId);
      expect(chk.item.properties.initialParent).toBe(defaultTemplate.item.id);

      expect(chk.item.tags).toContain("Hub Initiative");
      expect(chk.item.typeKeywords).toContain("hubInitiative");
      expect(chk.item.typeKeywords).not.toContain("hubInitiativeTemplate");
      ["id", "owner", "created_at", "modified_at"].forEach(prop => {
        expect(chk.item[prop]).not.toBeDefined(
          `item.${prop} should not be defined on`
        );
      });
      expect(chk.data.indicators).toBeDefined();
      expect(chk.data.values.collaborationGroupId).toBe(
        opts.collaborationGroupId
      );
      expect(chk.data.values.openDataGroupId).toBe(opts.openDataGroupId);
      expect(chk.data.values.initiativeKey).toBe(opts.initiativeKey);
    });
    it("should inject a default banner image", () => {
      const tmpl = cloneObject(defaultTemplate) as IInitiativeModel;
      delete tmpl.data.values.bannerImage;
      const opts = {
        title: "Death Star Initiative",
        collaborationGroupId: "bc45251",
        openDataGroupId: "bc45251",
        initiativeKey: "deathStarInitiative"
      };
      const chk = createInitiativeModelFromTemplate(tmpl, opts);
      expect(chk.data.values.bannerImage).toBeDefined();
    });
  });
});
