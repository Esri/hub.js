import { IUser } from "@esri/arcgis-rest-portal";
import { IChannel } from "../../../../../src/discussions/api/types";
import * as canCreatePostV2Module from "../../../../../src/discussions/api/utils/posts/can-create-post-v2";
import { cannotCreatePostGroupsBlockedV2 } from "../../../../../src/discussions/api/utils/posts/cannot-create-post-groups-blocked-v2";
import { CANNOT_DISCUSS } from "../../../../../src/discussions/constants";
import { vi, afterEach, describe, it, expect } from "vitest";
import { AclCategory } from "../../../../../src/discussions/api/enums/aclCategory";
import { AclSubCategory } from "../../../../../src/discussions/api/enums/aclSubCategory";
import { Role } from "../../../../../src/discussions/api/enums/role";

describe("cannotCreatePostGroupsBlockedV2", () => {
  afterEach(() => vi.restoreAllMocks());

  it("should return false when no user", () => {
    const canCreatePostV2Spy = vi
      .spyOn(canCreatePostV2Module, "canCreatePostV2")
      .mockReturnValue(false);
    const channel: IChannel = {
      id: "c1",
      channelAcl: [
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.READ,
          key: "g1",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.WRITE,
          key: "g2",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.READWRITE,
          key: "g3",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.MANAGE,
          key: "g4",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.MODERATE,
          key: "g5",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.OWNER,
          key: "g6",
        },
      ],
    } as unknown as IChannel;
    canCreatePostV2Spy.mockReturnValue(false);
    const result = cannotCreatePostGroupsBlockedV2(channel);
    expect(canCreatePostV2Spy).toHaveBeenCalledTimes(1);
    expect(canCreatePostV2Spy).toHaveBeenCalledWith(channel, {});
    expect(result).toBe(false);
  });

  it("should return false when user.groups is not set", () => {
    const canCreatePostV2Spy = vi
      .spyOn(canCreatePostV2Module, "canCreatePostV2")
      .mockReturnValue(true);
    const channel: IChannel = { id: "c1" } as unknown as IChannel;
    const user: IUser = { id: "u1" } as unknown as IUser;
    const result = cannotCreatePostGroupsBlockedV2(channel, user);
    expect(canCreatePostV2Spy).toHaveBeenCalledTimes(1);
    expect(canCreatePostV2Spy).toHaveBeenCalledWith(channel, user);
    expect(result).toBe(false);
  });

  it("should return false when the user can post", () => {
    const canCreatePostV2Spy = vi
      .spyOn(canCreatePostV2Module, "canCreatePostV2")
      .mockReturnValue(true);
    const channel: IChannel = { id: "c1" } as unknown as IChannel;
    const user: IUser = { id: "u1" } as unknown as IUser;
    const result = cannotCreatePostGroupsBlockedV2(channel, user);
    expect(canCreatePostV2Spy).toHaveBeenCalledTimes(1);
    expect(canCreatePostV2Spy).toHaveBeenCalledWith(channel, user);
    expect(result).toBe(false);
  });

  it("should return false when the user is not a member of any channel groups", () => {
    const canCreatePostV2Spy = vi
      .spyOn(canCreatePostV2Module, "canCreatePostV2")
      .mockReturnValue(false);
    const channel: IChannel = {
      id: "c1",
      channelAcl: [
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.READ,
          key: "g1",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.WRITE,
          key: "g2",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.READWRITE,
          key: "g3",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.MANAGE,
          key: "g4",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.MODERATE,
          key: "g5",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.OWNER,
          key: "g6",
        },
      ],
    } as unknown as IChannel;
    const user: IUser = { id: "u123", groups: [] } as unknown as IUser;
    const result = cannotCreatePostGroupsBlockedV2(channel, user);
    expect(canCreatePostV2Spy).toHaveBeenCalledTimes(1);
    expect(canCreatePostV2Spy).toHaveBeenCalledWith(channel, user);
    expect(result).toBe(false);
  });

  it("should return false when one or more of the channel groups the user has write+ membership to are discussable", () => {
    const canCreatePostV2Spy = vi
      .spyOn(canCreatePostV2Module, "canCreatePostV2")
      .mockReturnValue(false);
    const channel: IChannel = {
      id: "c1",
      channelAcl: [
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.READ,
          key: "g1",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.WRITE,
          key: "g2",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.READWRITE,
          key: "g3",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.MANAGE,
          key: "g4",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.MODERATE,
          key: "g5",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.OWNER,
          key: "g6",
        },
      ],
    } as unknown as IChannel;
    const user: IUser = {
      id: "u123",
      groups: [
        { id: "g3", typeKeywords: [CANNOT_DISCUSS] },
        { id: "g4", typeKeywords: [] },
      ],
    } as unknown as IUser;
    const result = cannotCreatePostGroupsBlockedV2(channel, user);
    expect(canCreatePostV2Spy).toHaveBeenCalledTimes(1);
    expect(canCreatePostV2Spy).toHaveBeenCalledWith(channel, user);
    expect(result).toBe(false);
  });

  it("should return true when all of the channel groups the user has write+ membership to are not discussable", () => {
    const canCreatePostV2Spy = vi
      .spyOn(canCreatePostV2Module, "canCreatePostV2")
      .mockReturnValue(false);
    const channel: IChannel = {
      id: "c1",
      channelAcl: [
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.READ,
          key: "g1",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.WRITE,
          key: "g2",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.READWRITE,
          key: "g3",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.MANAGE,
          key: "g4",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.MODERATE,
          key: "g5",
        },
        {
          category: AclCategory.GROUP,
          subCategory: AclSubCategory.MEMBER,
          role: Role.OWNER,
          key: "g6",
        },
      ],
    } as unknown as IChannel;
    const user: IUser = {
      id: "u123",
      groups: [
        { id: "g2", typeKeywords: [CANNOT_DISCUSS] },
        { id: "g3", typeKeywords: [CANNOT_DISCUSS] },
      ],
    } as unknown as IUser;
    const result = cannotCreatePostGroupsBlockedV2(channel, user);
    expect(canCreatePostV2Spy).toHaveBeenCalledTimes(1);
    expect(canCreatePostV2Spy).toHaveBeenCalledWith(channel, user);
    expect(result).toBe(true);
  });
});
