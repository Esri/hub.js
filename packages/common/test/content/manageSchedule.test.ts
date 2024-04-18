import { IItem } from "@esri/arcgis-rest-types";
import {
  deleteSchedule,
  getSchedule,
  maybeUpdateSchedule,
  setSchedule,
} from "../../src/content/manageSchedule";
import { IHubSchedule } from "../../src/core/types/IHubSchedule";
import { MOCK_HUB_REQOPTS } from "../mocks/mock-auth";
import { IHubRequestOptions } from "../../src/types";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";

const item = {
  id: "9b77674e43cf4bbd9ecad5189b3f1fdc",
  owner: "dcdev_dude",
  tags: ["Transportation"],
  created: 1595878748000,
  modified: 1595878750000,
  numViews: 0,
  size: 0,
  title: "my item",
  type: "",
} as IItem;

const dailySchedule = {
  mode: "scheduled",
  cadence: "daily",
  hour: 0,
  timezone: "America/New_York",
} as IHubSchedule;

describe("manageSchedule", () => {
  it("setSchedule", async () => {
    await setSchedule(item.id, dailySchedule, MOCK_HUB_REQOPTS);
    const schedule = await getSchedule(item.id, MOCK_HUB_REQOPTS);
    expect(schedule).toEqual(dailySchedule);
  });

  it("deleteSchedule", async () => {
    await deleteSchedule(item.id, MOCK_HUB_REQOPTS);
    const schedule = await getSchedule(item.id, MOCK_HUB_REQOPTS);
    expect(schedule).toBe(null);
  });

  it("deleteSchedule should fail", async () => {
    const isOk = await deleteSchedule(item.id, {
      ...MOCK_HUB_REQOPTS,
      hubApiUrl: "https://some.url.com/",
    } as unknown as IHubRequestOptions);
    expect(isOk).toBe(false);
  });

  it("maybeUpdateSchedule", async () => {
    const content: IHubEditableContent = {
      itemControl: "edit",
      id: item.id,
      name: "Hello World",
      tags: ["Transportation"],
      description: "Some longer description",
      slug: "dcdev-wat-blarg",
      orgUrlKey: "dcdev",
      owner: "dcdev_dude",
      type: "Hub Initiative",
      createdDate: new Date(1595878748000),
      createdDateSource: "item.created",
      updatedDate: new Date(1595878750000),
      updatedDateSource: "item.modified",
      thumbnailUrl: "",
      permissions: [],
      schemaVersion: 1,
      canEdit: false,
      canDelete: false,
      location: { type: "none" },
      licenseInfo: "",
      schedule: { mode: "automatic" },
    };
    // no schedule set previosly, and incoming schedule is automatic -- we should expect null
    const chk = await maybeUpdateSchedule(content, MOCK_HUB_REQOPTS);
    expect(chk).toBe(false);

    const repsonse = await getSchedule(content.id, MOCK_HUB_REQOPTS);
    expect(repsonse).toBe(null);
  });
});
