import { IArcGISContext } from "../../src/ArcGISContext";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import { canUseHubDownloadApi } from "../../src/downloads/canUseHubDownloadApi";
import * as canUseCreateReplicaModule from "../../src/downloads/canUseCreateReplica";

describe("canUseHubDownloadApi", () => {
  it("should return false if download API status is not available", () => {
    const canUseCreateReplicaSpy = spyOn(
      canUseCreateReplicaModule,
      "canUseCreateReplica"
    ).and.returnValue(true);
    const entity = {
      type: "Feature Service",
      access: "public",
    } as unknown as IHubEditableContent;
    const context = {} as unknown as IArcGISContext;

    const result = canUseHubDownloadApi(entity, context);

    expect(result).toBe(false);
    expect(canUseCreateReplicaSpy).not.toHaveBeenCalled();
  });
  it("should return false if download API status is not online", () => {
    const canUseCreateReplicaSpy = spyOn(
      canUseCreateReplicaModule,
      "canUseCreateReplica"
    ).and.returnValue(true);
    const entity = {
      type: "Feature Service",
      access: "public",
    } as unknown as IHubEditableContent;
    const context = {
      serviceStatus: {
        "hub-downloads": "offline",
      },
    } as unknown as IArcGISContext;

    const result = canUseHubDownloadApi(entity, context);

    expect(result).toBe(false);
    expect(canUseCreateReplicaSpy).not.toHaveBeenCalled();
  });

  it("should return false if the entity is not a service entity", () => {
    const canUseCreateReplicaSpy = spyOn(
      canUseCreateReplicaModule,
      "canUseCreateReplica"
    ).and.returnValue(false);
    const entity = {
      type: "Web Map",
      access: "public",
    } as unknown as IHubEditableContent;
    const context = {
      serviceStatus: {
        "hub-downloads": "online",
      },
    } as unknown as IArcGISContext;

    const result = canUseHubDownloadApi(entity, context);

    expect(result).toBe(false);
    expect(canUseCreateReplicaSpy).toHaveBeenCalledTimes(1);
  });

  it("should return false if the service entity cannot use paging jobs or createReplica ", () => {
    const canUseCreateReplicaSpy = spyOn(
      canUseCreateReplicaModule,
      "canUseCreateReplica"
    ).and.returnValue(false);
    const entity = {
      type: "Feature Service",
      access: "private",
    } as unknown as IHubEditableContent;
    const context = {
      serviceStatus: {
        "hub-downloads": "online",
      },
    } as unknown as IArcGISContext;

    const result = canUseHubDownloadApi(entity, context);

    expect(result).toBe(false);
    expect(canUseCreateReplicaSpy).toHaveBeenCalledTimes(1);
  });

  it("should return true if the service entity cannot use paging jobs but can use createReplica ", () => {
    const canUseCreateReplicaSpy = spyOn(
      canUseCreateReplicaModule,
      "canUseCreateReplica"
    ).and.returnValue(true);
    const entity = {
      type: "Feature Service",
      access: "private",
    } as unknown as IHubEditableContent;
    const context = {
      serviceStatus: {
        "hub-downloads": "online",
      },
    } as unknown as IArcGISContext;

    const result = canUseHubDownloadApi(entity, context);

    expect(result).toBe(true);
    expect(canUseCreateReplicaSpy).toHaveBeenCalledTimes(1);
  });

  it("should return true if the service entity can use paging jobs", () => {
    spyOn(canUseCreateReplicaModule, "canUseCreateReplica").and.returnValue(
      false
    );
    const entity = {
      type: "Map Service",
      access: "public",
    } as unknown as IHubEditableContent;
    const context = {
      serviceStatus: {
        "hub-downloads": "online",
      },
    } as unknown as IArcGISContext;

    const result = canUseHubDownloadApi(entity, context);

    expect(result).toBe(true);
  });
});
