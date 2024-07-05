import { IItem } from "@esri/arcgis-rest-portal";
import * as manageScheduleModule from "../../../src/content/manageSchedule";
import { IHubSchedule } from "../../../src/core/types/IHubSchedule";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { fetchItemScheduleEnrichment } from "../../../src/content/_internal/fetchItemScheduleEnrichment";

describe("fetchItemScheduleEnrichment", () => {
  let isDownloadSchedulingAvailableSpy: jasmine.Spy;
  let getScheduleSpy: jasmine.Spy;
  beforeEach(() => {
    spyOn(console, "warn").and.callFake((): any => null);
    isDownloadSchedulingAvailableSpy = spyOn(
      manageScheduleModule,
      "isDownloadSchedulingAvailable"
    );
    getScheduleSpy = spyOn(manageScheduleModule, "getSchedule");
  });
  it("should handle when download scheduling is not available", async () => {
    isDownloadSchedulingAvailableSpy.and.returnValue(false);

    const item = {
      id: "abc123",
      access: "public",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;

    const chk = await fetchItemScheduleEnrichment(item, requestOptions);

    expect(chk).toBeUndefined();
    expect(getScheduleSpy).not.toHaveBeenCalled();
  });
  it("should handle when an error occurs while fetching the schedule", async () => {
    isDownloadSchedulingAvailableSpy.and.returnValue(true);
    getScheduleSpy.and.throwError("oh noes");

    const item = {
      id: "abc123",
      access: "public",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;

    const chk = await fetchItemScheduleEnrichment(item, requestOptions);

    expect(chk).toBeUndefined();
    expect(getScheduleSpy).toHaveBeenCalledTimes(1);
    expect(getScheduleSpy).toHaveBeenCalledWith(item.id, requestOptions);
  });
  it("should return a default if download scheduling is available but hasn't been configured", async () => {
    isDownloadSchedulingAvailableSpy.and.returnValue(true);
    getScheduleSpy.and.returnValue(Promise.resolve({}));

    const item = {
      id: "abc123",
      access: "public",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;

    const chk = await fetchItemScheduleEnrichment(item, requestOptions);

    expect(chk).toEqual({ mode: "automatic" });
    expect(getScheduleSpy).toHaveBeenCalledTimes(1);
    expect(getScheduleSpy).toHaveBeenCalledWith(item.id, requestOptions);
  });
  it("return the set schedule if download scheduling is available and has been configured", async () => {
    isDownloadSchedulingAvailableSpy.and.returnValue(true);

    const schedule = { mode: "manual" } as IHubSchedule;
    getScheduleSpy.and.returnValue(Promise.resolve({ schedule }));

    const item = {
      id: "abc123",
      access: "public",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;

    const chk = await fetchItemScheduleEnrichment(item, requestOptions);

    expect(chk).toBe(schedule);
    expect(getScheduleSpy).toHaveBeenCalledTimes(1);
    expect(getScheduleSpy).toHaveBeenCalledWith(item.id, requestOptions);
  });
});
