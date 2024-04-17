import { IItem } from "@esri/arcgis-rest-types";
import {
  deleteSchedule,
  getSchedule,
  setSchedule,
} from "../../src/content/manageSchedule";
import { IHubSchedule } from "../../src/core/types/IHubSchedule";
import { MOCK_AUTH, MOCK_HUB_REQOPTS, TOMORROW } from "../mocks/mock-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";

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
    await setSchedule(item, dailySchedule, MOCK_HUB_REQOPTS);
    const schedule = await getSchedule(item, MOCK_HUB_REQOPTS);
    expect(schedule).toEqual(dailySchedule);
  });

  it("deleteSchedule", async () => {
    await deleteSchedule(item, MOCK_HUB_REQOPTS);
    const schedule = await getSchedule(item, MOCK_HUB_REQOPTS);
    expect(schedule).toBe(null);
  });
});
