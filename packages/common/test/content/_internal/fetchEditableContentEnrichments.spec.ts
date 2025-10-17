import { IItem } from "@esri/arcgis-rest-portal";
import { fetchEditableContentEnrichments } from "../../../src/content/_internal/fetchEditableContentEnrichments";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import * as enrichmentsModule from "../../../src/items/_enrichments";
import { IHubSchedule } from "../../../src/core/types/IHubSchedule";
import * as isServiceModule from "../../../src/resources/is-service";
import * as fetchItemScheduleEnrichmentModule from "../../../src/content/_internal/fetchItemScheduleEnrichment";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("fetchEditableContentEnrichments", () => {
  let isServiceSpy: any;
  let fetchItemEnrichmentsSpy: any;
  let fetchItemScheduleEnrichmentSpy: any;
  beforeEach(() => {
    isServiceSpy = vi.spyOn(isServiceModule, "isService");
    fetchItemEnrichmentsSpy = vi.spyOn(
      enrichmentsModule,
      "fetchItemEnrichments"
    );
    fetchItemScheduleEnrichmentSpy = vi.spyOn(
      fetchItemScheduleEnrichmentModule,
      "fetchItemScheduleEnrichment"
    );
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch default enrichments for non-service content", async () => {
    isServiceSpy.mockReturnValue(false as any);

    const metadata = { metadata: "value" };
    fetchItemEnrichmentsSpy.mockResolvedValue({ metadata } as any);

    const schedule = { mode: "manual" } as unknown as IHubSchedule;
    fetchItemScheduleEnrichmentSpy.mockResolvedValue(schedule as any);

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
    isServiceSpy.mockReturnValue(true as any);

    const metadata = { metadata: "value" };
    const server = {
      server: "value",
    } as unknown as enrichmentsModule.IHubEditableContentEnrichments["server"];
    fetchItemEnrichmentsSpy.mockResolvedValue({ metadata, server } as any);

    const schedule = { mode: "manual" } as unknown as IHubSchedule;
    fetchItemScheduleEnrichmentSpy.mockResolvedValue(schedule as any);

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
    isServiceSpy.mockReturnValue(true as any);

    const metadata = { metadata: "value" };
    fetchItemEnrichmentsSpy.mockResolvedValue({ metadata } as any);

    const schedule = { mode: "manual" } as unknown as IHubSchedule;
    fetchItemScheduleEnrichmentSpy.mockResolvedValue(schedule as any);

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
    isServiceSpy.mockReturnValue(true as any);
    fetchItemEnrichmentsSpy.mockResolvedValue({} as any);
    fetchItemScheduleEnrichmentSpy.mockResolvedValue(null as any);

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
