import { IItem } from "@esri/arcgis-rest-portal";
import { fetchEditableContentEnrichments } from "../../../src/content/_internal/fetchEditableContentEnrichments";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import * as enrichmentsModule from "../../../src/items/_enrichments";
import { IHubSchedule } from "../../../src/core/types/IHubSchedule";
import * as validateUrlHelpersModule from "../../../src/resources/_internal/_validate-url-helpers";
import * as fetchItemScheduleEnrichmentModule from "../../../src/content/_internal/fetchItemScheduleEnrichment";

describe("fetchEditableContentEnrichments", () => {
  let isServiceSpy: jasmine.Spy;
  let fetchItemEnrichmentsSpy: jasmine.Spy;
  let fetchItemScheduleEnrichmentSpy: jasmine.Spy;
  beforeEach(() => {
    isServiceSpy = spyOn(validateUrlHelpersModule, "isService");
    fetchItemEnrichmentsSpy = spyOn(enrichmentsModule, "fetchItemEnrichments");
    fetchItemScheduleEnrichmentSpy = spyOn(
      fetchItemScheduleEnrichmentModule,
      "fetchItemScheduleEnrichment"
    );
  });

  it("should fetch default enrichments for non-service content", async () => {
    isServiceSpy.and.returnValue(false);

    const metadata = { metadata: "value" };
    fetchItemEnrichmentsSpy.and.returnValue(Promise.resolve({ metadata }));

    const schedule = { mode: "manual" } as unknown as IHubSchedule;
    fetchItemScheduleEnrichmentSpy.and.returnValue(Promise.resolve(schedule));

    const item = {
      id: "abc123",
      type: "Web Map",
      access: "public",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;

    const chk = await fetchEditableContentEnrichments(item, requestOptions);
    expect(chk.metadata).toBe(metadata);
    expect(chk.schedule).toBe(schedule);
    expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(1);
    expect(fetchItemEnrichmentsSpy).toHaveBeenCalledWith(
      item,
      ["metadata"],
      requestOptions
    );
    expect(fetchItemScheduleEnrichmentSpy).toHaveBeenCalledTimes(1);
    expect(fetchItemScheduleEnrichmentSpy).toHaveBeenCalledWith(
      item,
      requestOptions
    );
  });

  it("should fetch default enrichments for service-backed content", async () => {
    isServiceSpy.and.returnValue(true);

    const metadata = { metadata: "value" };
    const server = {
      server: "value",
    } as unknown as enrichmentsModule.IHubEditableContentEnrichments["server"];
    fetchItemEnrichmentsSpy.and.returnValue(
      Promise.resolve({ metadata, server })
    );

    const schedule = { mode: "manual" } as unknown as IHubSchedule;
    fetchItemScheduleEnrichmentSpy.and.returnValue(Promise.resolve(schedule));

    const item = {
      id: "abc123",
      type: "Feature Service",
      access: "public",
      url: "my-service-url",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;

    const chk = await fetchEditableContentEnrichments(item, requestOptions);
    expect(chk.server).toBe(server);
    expect(chk.metadata).toBe(metadata);
    expect(chk.schedule).toBe(schedule);
    expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(1);
    expect(fetchItemEnrichmentsSpy).toHaveBeenCalledWith(
      item,
      ["metadata", "server"],
      requestOptions
    );
    expect(fetchItemScheduleEnrichmentSpy).toHaveBeenCalledTimes(1);
    expect(fetchItemScheduleEnrichmentSpy).toHaveBeenCalledWith(
      item,
      requestOptions
    );
  });

  it("should respect custom enrichment requests", async () => {
    isServiceSpy.and.returnValue(true);

    const metadata = { metadata: "value" };
    fetchItemEnrichmentsSpy.and.returnValue(Promise.resolve({ metadata }));

    const schedule = { mode: "manual" } as unknown as IHubSchedule;
    fetchItemScheduleEnrichmentSpy.and.returnValue(Promise.resolve(schedule));

    const item = {
      id: "abc123",
      type: "Feature Service",
      access: "public",
      url: "my-service-url",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;
    const enrichments: enrichmentsModule.EditableContentEnrichment[] = [
      "metadata",
      "schedule",
    ];

    const chk = await fetchEditableContentEnrichments(
      item,
      requestOptions,
      enrichments
    );
    expect(chk.metadata).toBe(metadata);
    expect(chk.schedule).toBe(schedule);
    expect(chk.server).toBeUndefined(); // undefined because we didn't ask for it
    expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(1);
    expect(fetchItemEnrichmentsSpy).toHaveBeenCalledWith(
      item,
      ["metadata"],
      requestOptions
    );
    expect(fetchItemScheduleEnrichmentSpy).toHaveBeenCalledTimes(1);
  });

  it("does not fetch enrichments when an empty array is provided", async () => {
    isServiceSpy.and.returnValue(true);
    fetchItemEnrichmentsSpy.and.returnValue(Promise.resolve({}));
    fetchItemScheduleEnrichmentSpy.and.returnValue(Promise.resolve(null));

    const item = {
      id: "abc123",
      type: "Feature Service",
      access: "public",
      url: "my-service-url",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;
    const enrichments: enrichmentsModule.EditableContentEnrichment[] = [];

    const chk = await fetchEditableContentEnrichments(
      item,
      requestOptions,
      enrichments
    );

    expect(chk.metadata).toBeUndefined();
    expect(chk.schedule).toBeUndefined();
    expect(chk.server).toBeUndefined();
    expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(0);
    expect(fetchItemScheduleEnrichmentSpy).toHaveBeenCalledTimes(0);
  });
});
