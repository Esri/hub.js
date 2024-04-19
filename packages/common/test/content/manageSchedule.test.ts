import {
  deleteSchedule,
  getSchedule,
  maybeUpdateSchedule,
  setSchedule,
} from "../../src/content/manageSchedule";
import { IHubSchedule } from "../../src/core/types/IHubSchedule";
import { MOCK_HUB_REQOPTS } from "../mocks/mock-auth";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import * as fetchMock from "fetch-mock";

describe("manageSchedule", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("getSchedule: returns null if no schedule is set", async () => {
    const item = { id: "123" };
    fetchMock.once(
      `https://hubqa.arcgis.com/api/download/v1/items/${item.id}/schedule`,
      {
        error: "Not Found",
        message: `Download schedule for the item ${item.id} is not found.`,
        statusCode: 404,
      }
    );
    const response = await getSchedule(item.id, MOCK_HUB_REQOPTS);
    expect(response).toEqual(null);
    expect(fetchMock.calls().length).toBe(1);
  });

  it("getSchedule: returns schedule if set", async () => {
    const item = { id: "123" };
    fetchMock.once(
      `https://hubqa.arcgis.com/api/download/v1/items/${item.id}/schedule`,
      {
        cadence: "daily",
        hour: 0,
        timezone: "America/New_York",
      }
    );
    const response = await getSchedule(item.id, MOCK_HUB_REQOPTS);
    expect(response).toEqual({
      mode: "scheduled",
      cadence: "daily",
      hour: 0,
      timezone: "America/New_York",
    });
    expect(fetchMock.calls().length).toBe(1);
  });

  it("setSchedule: sets the item's schedule", async () => {
    const item = { id: "123" };
    const schedule = {
      mode: "scheduled",
      cadence: "daily",
      hour: 0,
      timezone: "America/New_York",
    } as IHubSchedule;

    fetchMock.post(
      `https://hubqa.arcgis.com/api/download/v1/items/${item.id}/schedule`,
      {
        message: "Download schedule set successfully.",
      }
    );

    const response = await setSchedule(item.id, schedule, MOCK_HUB_REQOPTS);
    expect(response.message).toEqual("Download schedule set successfully.");
    expect(fetchMock.calls().length).toBe(1);
  });

  it("setSchedule: attempts to set an invalid schedule", async () => {
    const item = { id: "123" };
    const schedule = {
      mode: "scheduled",
      cadence: "daily",
      hour: 26,
      timezone: "America/New_York",
    } as IHubSchedule;

    fetchMock.post(
      `https://hubqa.arcgis.com/api/download/v1/items/${item.id}/schedule`,
      {
        title: "unit out of range",
        message:
          "you specified 26 (of type number) as a hour, which is invalid",
      }
    );

    const response = await setSchedule(item.id, schedule, MOCK_HUB_REQOPTS);
    expect(response.message).toEqual(
      "you specified 26 (of type number) as a hour, which is invalid"
    );
    expect(fetchMock.calls().length).toBe(1);
  });

  it("deleteSchedule: tries to delete an item's schedule", async () => {
    const item = { id: "123" };

    fetchMock.delete(
      `https://hubqa.arcgis.com/api/download/v1/items/${item.id}/schedule`,
      {
        message: "Download schedule deleted successfully.",
      }
    );

    const response = await deleteSchedule(item.id, MOCK_HUB_REQOPTS);
    expect(response.message).toEqual("Download schedule deleted successfully.");
    expect(fetchMock.calls().length).toBe(1);
  });

  it("maybeUpdateSchedule: no schedule is set, and updating to automatic is not needed", async () => {
    const item = { id: "123" };
    const content = {
      id: item.id,
      schedule: { mode: "automatic" },
    } as IHubEditableContent;

    fetchMock.get(
      `https://hubqa.arcgis.com/api/download/v1/items/${item.id}/schedule`,
      {
        error: "Not Found",
        message: `Download schedule for the item ${item.id} is not found.`,
        statusCode: 404,
      }
    );

    const response = await maybeUpdateSchedule(content, MOCK_HUB_REQOPTS);
    expect(response).toEqual(false);
    expect(fetchMock.calls().length).toBe(1);
  });

  it("maybeUpdateSchedule: no schedule is set, and updatinng to scheduled is needed", async () => {
    const item = { id: "123" };
    const content = {
      id: item.id,
      schedule: {
        mode: "scheduled",
        cadence: "daily",
        hour: 0,
        timezone: "America/New_York",
      },
    } as IHubEditableContent;

    fetchMock
      .get(
        `https://hubqa.arcgis.com/api/download/v1/items/${item.id}/schedule`,
        {
          error: "Not Found",
          message: `Download schedule for the item ${item.id} is not found.`,
          statusCode: 404,
        }
      )
      .post(
        `https://hubqa.arcgis.com/api/download/v1/items/${item.id}/schedule`,
        {
          message: "Download schedule set successfully.",
        }
      );

    const response = await maybeUpdateSchedule(content, MOCK_HUB_REQOPTS);
    expect(response.message).toEqual("Download schedule set successfully.");
    expect(fetchMock.calls().length).toBe(2);
  });

  it("maybeUpdateSchedule: schedule is set, and updating to automatic requires deleting the schedule", async () => {
    const item = { id: "123" };
    const content = {
      id: item.id,
      schedule: { mode: "automatic" },
    } as IHubEditableContent;

    fetchMock
      .get(
        `https://hubqa.arcgis.com/api/download/v1/items/${item.id}/schedule`,
        {
          cadence: "daily",
          hour: 0,
          timezone: "America/New_York",
        }
      )
      .delete(
        `https://hubqa.arcgis.com/api/download/v1/items/${item.id}/schedule`,
        {
          message: "Download schedule deleted successfully.",
        }
      );

    const response = await maybeUpdateSchedule(content, MOCK_HUB_REQOPTS);
    expect(response.message).toEqual("Download schedule deleted successfully.");
    expect(fetchMock.calls().length).toBe(2);
  });

  it("maybeUpdateSchedule: schedule is set, and no action is needed as schedules deepEqual each other", async () => {
    const item = { id: "123" };
    const content = {
      id: item.id,
      schedule: {
        mode: "scheduled",
        cadence: "daily",
        hour: 0,
        timezone: "America/New_York",
      },
    } as IHubEditableContent;

    fetchMock.get(
      `https://hubqa.arcgis.com/api/download/v1/items/${item.id}/schedule`,
      {
        cadence: "daily",
        hour: 0,
        timezone: "America/New_York",
      }
    );

    const response = await maybeUpdateSchedule(content, MOCK_HUB_REQOPTS);
    expect(response).toEqual(false);
    expect(fetchMock.calls().length).toBe(1);
  });
});
