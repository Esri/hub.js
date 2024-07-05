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

    const data = { data: "value" };
    const metadata = { metadata: "value" };
    fetchItemEnrichmentsSpy.and.returnValue(
      Promise.resolve({ data, metadata })
    );

    const schedule = { mode: "manual" } as unknown as IHubSchedule;
    fetchItemScheduleEnrichmentSpy.and.returnValue(Promise.resolve(schedule));

    const item = {
      id: "abc123",
      type: "Web Map",
      access: "public",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;

    const chk = await fetchEditableContentEnrichments(item, requestOptions);
    expect(chk.data).toBe(data);
    expect(chk.metadata).toBe(metadata);
    expect(chk.schedule).toBe(schedule);
    expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(1);
    expect(fetchItemEnrichmentsSpy).toHaveBeenCalledWith(
      item,
      ["data", "metadata"],
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

    const data = { data: "value" };
    const metadata = { metadata: "value" };
    const server = {
      server: "value",
    } as unknown as enrichmentsModule.IHubEditableContentEnrichments["server"];
    fetchItemEnrichmentsSpy.and.returnValue(
      Promise.resolve({ data, metadata, server })
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
    expect(chk.data).toBe(data);
    expect(chk.metadata).toBe(metadata);
    expect(chk.schedule).toBe(schedule);
    expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(1);
    expect(fetchItemEnrichmentsSpy).toHaveBeenCalledWith(
      item,
      ["data", "metadata", "server"],
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

    const data = { data: "value" };
    fetchItemEnrichmentsSpy.and.returnValue(Promise.resolve({ data }));

    const schedule = { mode: "manual" } as unknown as IHubSchedule;
    fetchItemScheduleEnrichmentSpy.and.returnValue(Promise.resolve(schedule));

    const item = {
      id: "abc123",
      type: "Web Map",
      access: "public",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;
    const enrichments = [
      "data",
      "schedule",
    ] as enrichmentsModule.EditableContentEnrichment[];

    const chk = await fetchEditableContentEnrichments(
      item,
      requestOptions,
      enrichments
    );
    expect(chk.data).toBe(data);
    expect(chk.metadata).toBeUndefined();
    expect(chk.schedule).toBe(schedule);
    expect(chk.server).toBeUndefined();
    expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(1);
    expect(fetchItemEnrichmentsSpy).toHaveBeenCalledWith(
      item,
      ["data"],
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
      type: "Web Map",
      access: "public",
    } as unknown as IItem;
    const requestOptions = {} as IRequestOptions;
    const enrichments = [] as enrichmentsModule.EditableContentEnrichment[];

    const chk = await fetchEditableContentEnrichments(
      item,
      requestOptions,
      enrichments
    );
    expect(chk.data).toBe(undefined);
    expect(chk.metadata).toBeUndefined();
    expect(chk.schedule).toBeUndefined();
    expect(chk.server).toBeUndefined();
    expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(0);
    expect(fetchItemScheduleEnrichmentSpy).toHaveBeenCalledTimes(0);
  });
});
