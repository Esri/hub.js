import { _secondPassAdlibPages } from "../src";
import { IModelTemplate } from "@esri/hub-common";

describe("_secondPassAdlibPages", () => {
  it("_secondPassAdlibPages adlibs Page", function() {
    const site = ({
      item: {
        id: "bc3",
        type: "Hub Site Application",
        url: "https://somesite.com",
        properties: {
          collaborationGroupId: "grpCollab",
          followersGroupId: "grpFlw",
          contentGroupId: "grpCtn",
          parentInitiativeId: "initId"
        }
      },
      key: "bleep-boop",
      data: {}
    } as unknown) as IModelTemplate;
    const page = ({
      item: { id: "ef1", type: "Hub Page" },
      data: {
        values: { sites: [] },
        chk: {
          collab: "{{teams.collaborationGroupId}}",
          follow: "{{teams.followersGroupId}}",
          content: "{{teams.contentGroupId}}",
          siteId: "{{siteId}}",
          siteUrl: "{{siteUrl}}",
          initId: "{{initiative.item.id}}",
          deep: "{{bleep-boop.item.id}}"
        }
      }
    } as unknown) as IModelTemplate;
    const updated = _secondPassAdlibPages(site, page);

    const chk = updated.data.chk;
    expect(chk.collab).toBe("grpCollab");
    expect(chk.follow).toBe("grpFlw");
    expect(chk.collab).toBe("grpCollab");
    expect(chk.content).toBe("grpCtn");
    expect(chk.siteId).toBe("bc3");
    expect(chk.siteUrl).toBe("https://somesite.com");
    expect(chk.initId).toBe("initId");
    expect(chk.deep).toBe("bc3");
  });

  it("works when some groups doent exist", function() {
    const site = ({
      item: {
        id: "bc3",
        type: "Hub Site Application",
        url: "https://somesite.com",
        properties: {
          collaborationGroupId: "grpCollab",
          // followers missing
          contentGroupId: "grpCtn",
          parentInitiativeId: "initId"
        }
      },
      key: "bleep-boop",
      data: {}
    } as unknown) as IModelTemplate;
    const page = ({
      item: { id: "ef1", type: "Hub Page" },
      data: {
        values: { sites: [] },
        chk: {
          collab: "{{teams.collaborationGroupId}}",
          content: "{{teams.contentGroupId}}",
          siteId: "{{siteId}}",
          siteUrl: "{{siteUrl}}",
          initId: "{{initiative.item.id}}",
          deep: "{{bleep-boop.item.id}}"
        }
      }
    } as unknown) as IModelTemplate;
    const updated = _secondPassAdlibPages(site, page);

    const chk = updated.data.chk;
    expect(chk.collab).toBe("grpCollab");
    expect(chk.follow).not.toBeDefined();
    expect(chk.collab).toBe("grpCollab");
    expect(chk.content).toBe("grpCtn");
    expect(chk.siteId).toBe("bc3");
    expect(chk.siteUrl).toBe("https://somesite.com");
    expect(chk.initId).toBe("initId");
    expect(chk.deep).toBe("bc3");
  });
});
