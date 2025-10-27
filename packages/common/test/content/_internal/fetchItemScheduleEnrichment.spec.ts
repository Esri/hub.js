import { IItem } from "@esri/arcgis-rest-portal";
import * as manageScheduleModule from "../../../src/content/manageSchedule";
import { IHubSchedule } from "../../../src/core/types/IHubSchedule";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { fetchItemScheduleEnrichment } from "../../../src/content/_internal/fetchItemScheduleEnrichment";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("fetchItemScheduleEnrichment", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation((): any => null);
    vi.spyOn(manageScheduleModule, "isDownloadSchedulingAvailable");
    vi.spyOn(manageScheduleModule, "getSchedule");
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("should handle when download scheduling is not available", async () => {
    vi.spyOn(
      manageScheduleModule,
      "isDownloadSchedulingAvailable"
    ).mockReturnValue(false as any);

    const item = {
      id: "abc123",
      access: "public",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;

    const chk = await fetchItemScheduleEnrichment(item, requestOptions);

    expect(chk).toBeUndefined();
    expect(manageScheduleModule.getSchedule).not.toHaveBeenCalled();
  });
  it("should handle when an error occurs while fetching the schedule", async () => {
    vi.spyOn(
      manageScheduleModule,
      "isDownloadSchedulingAvailable"
    ).mockReturnValue(true as any);
    vi.spyOn(manageScheduleModule, "getSchedule").mockImplementation(() => {
      throw new Error("oh noes");
    });

    const item = {
      id: "abc123",
      access: "public",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;

    const chk = await fetchItemScheduleEnrichment(item, requestOptions);

    expect(chk).toBeUndefined();
    expect(manageScheduleModule.getSchedule).toHaveBeenCalledTimes(1);
    expect(manageScheduleModule.getSchedule).toHaveBeenCalledWith(
      item.id,
      requestOptions
    );
  });
  it("should return a default if download scheduling is available but hasn't been configured", async () => {
    vi.spyOn(
      manageScheduleModule,
      "isDownloadSchedulingAvailable"
    ).mockReturnValue(true as any);
    vi.spyOn(manageScheduleModule, "getSchedule").mockResolvedValue({} as any);

    const item = {
      id: "abc123",
      access: "public",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;

    const chk = await fetchItemScheduleEnrichment(item, requestOptions);

    expect(chk).toEqual({ mode: "automatic" });
    expect(manageScheduleModule.getSchedule).toHaveBeenCalledTimes(1);
    expect(manageScheduleModule.getSchedule).toHaveBeenCalledWith(
      item.id,
      requestOptions
    );
  });
  it("return the set schedule if download scheduling is available and has been configured", async () => {
    vi.spyOn(
      manageScheduleModule,
      "isDownloadSchedulingAvailable"
    ).mockReturnValue(true as any);

    const schedule = { mode: "manual" } as IHubSchedule;
    vi.spyOn(manageScheduleModule, "getSchedule").mockResolvedValue({
      schedule,
    } as any);

    const item = {
      id: "abc123",
      access: "public",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;

    const chk = await fetchItemScheduleEnrichment(item, requestOptions);

    expect(chk).toBe(schedule);
    expect(manageScheduleModule.getSchedule).toHaveBeenCalledTimes(1);
    expect(manageScheduleModule.getSchedule).toHaveBeenCalledWith(
      item.id,
      requestOptions
    );
  });
});
