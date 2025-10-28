import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";
import { canUseHubDownloadApi } from "../../src/downloads/canUseHubDownloadApi";
import * as canUseCreateReplicaModule from "../../src/downloads/canUseCreateReplica";
import * as canUseHubDownloadSystemModule from "../../src/downloads/canUseHubDownloadSystem";
import { IArcGISContext } from "../../src/types/IArcGISContext";

describe("canUseHubDownloadApi", () => {
  it("should return false if download API status is not available", () => {
    const canUseHubDownloadSystemSpy = vi
      .spyOn(canUseHubDownloadSystemModule, "canUseHubDownloadSystem")
      .mockReturnValue(true);

    const canUseCreateReplicaSpy = vi
      .spyOn(canUseCreateReplicaModule, "canUseCreateReplica")
      .mockReturnValue(true);

    const entity = {
      type: "Feature Service",
      access: "public",
    } as unknown as IHubEditableContent;

    const context = {} as unknown as IArcGISContext;

    const result = canUseHubDownloadApi(entity, context);

    expect(result).toBe(false);
    expect(canUseHubDownloadSystemSpy).not.toHaveBeenCalled();
    expect(canUseCreateReplicaSpy).not.toHaveBeenCalled();
  });

  it("should return false if download API status is not online", () => {
    const canUseHubDownloadSystemSpy = vi
      .spyOn(canUseHubDownloadSystemModule, "canUseHubDownloadSystem")
      .mockReturnValue(true);

    const canUseCreateReplicaSpy = vi
      .spyOn(canUseCreateReplicaModule, "canUseCreateReplica")
      .mockReturnValue(true);

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
    expect(canUseHubDownloadSystemSpy).not.toHaveBeenCalled();
    expect(canUseCreateReplicaSpy).not.toHaveBeenCalled();
  });

  it("should return false if the service entity cannot use the hub download system or createReplica ", () => {
    const canUseHubDownloadSystemSpy = vi
      .spyOn(canUseHubDownloadSystemModule, "canUseHubDownloadSystem")
      .mockReturnValue(false);

    const canUseCreateReplicaSpy = vi
      .spyOn(canUseCreateReplicaModule, "canUseCreateReplica")
      .mockReturnValue(false);

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
    expect(canUseHubDownloadSystemSpy).toHaveBeenCalledTimes(1);
    expect(canUseCreateReplicaSpy).toHaveBeenCalledTimes(1);
  });

  it("should return true if the service entity cannot use the hub download system but can use createReplica ", () => {
    const canUseHubDownloadSystemSpy = vi
      .spyOn(canUseHubDownloadSystemModule, "canUseHubDownloadSystem")
      .mockReturnValue(false);

    const canUseCreateReplicaSpy = vi
      .spyOn(canUseCreateReplicaModule, "canUseCreateReplica")
      .mockReturnValue(true);
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
    expect(canUseHubDownloadSystemSpy).toHaveBeenCalledTimes(1);
    expect(canUseCreateReplicaSpy).toHaveBeenCalledTimes(1);
  });

  it("should return true if the service entity can use the hub download system", () => {
    vi.spyOn(
      canUseHubDownloadSystemModule,
      "canUseHubDownloadSystem"
    ).mockReturnValue(true);

    vi.spyOn(canUseCreateReplicaModule, "canUseCreateReplica").mockReturnValue(
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
