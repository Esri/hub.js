import { vi, afterEach, describe, it, expect } from "vitest";
import {
  IChannel,
  IDiscussionsUser,
} from "../../../../../src/discussions/api/types";
import { canCreateReply } from "../../../../../src/discussions/api/utils/posts/can-create-reply";
import * as portalPrivModule from "../../../../../src/discussions/api/utils/portal-privilege";

describe("canCreateReply", () => {
  afterEach(() => vi.restoreAllMocks());

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminUpdateRights returns true", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => true);

      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa", allowReply: true } as IChannel;

      expect(canCreateReply(channel, user)).toBe(true);

      expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);
    });
  });

  describe("with legacy permissions", () => {
    it("returns false if undefined user attempts to create post in public allowAnonymous === true channel", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      const channel = {
        access: "public",
        allowReply: true,
        allowAnonymous: true,
      } as IChannel;

      expect(canCreateReply(channel)).toBe(false);
    });

    it("returns false if anonymous user attempts to create post in public allowAnonymous === true channel", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      const user: IDiscussionsUser = { username: null } as any;
      const channel = {
        allowReply: true,
        allowAnonymous: true,
        access: "public",
      } as IChannel;

      expect(canCreateReply(channel, user)).toBe(false);
    });

    it("returns false if anonymous user attempts to create post in public allowAnonymous === false channel", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      const user: IDiscussionsUser = { username: null } as any;
      const channel = {
        allowReply: true,
        allowAnonymous: false,
        access: "public",
      } as IChannel;

      expect(canCreateReply(channel, user)).toBe(false);
    });

    it("returns true if authenticated user attempts to create post in public-access channel", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      const user: IDiscussionsUser = { username: "Slughorn" } as any;
      const channel = {
        allowReply: true,
        access: "public",
        allowAnonymous: false,
      } as IChannel;

      expect(canCreateReply(channel, user)).toBe(true);
    });

    it("returns true if group authorized user attempts to create post in private-access channel", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      const user: IDiscussionsUser = {
        username: "Slughorn",
        groups: [
          {
            id: "abc",
            userMembership: { memberType: "member" },
            typeKeywords: [],
          },
        ],
      } as any;
      const channel = {
        allowReply: true,
        access: "private",
        allowAnonymous: false,
        groups: ["abc"],
      } as any;

      expect(canCreateReply(channel, user)).toBe(true);
    });

    it("returns true if a group authorized user attempts to create post in private-access channel, but at least one group is NOT marked cannotDiscuss", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      const user: IDiscussionsUser = {
        username: "Slughorn",
        groups: [
          {
            id: "abc",
            userMembership: { memberType: "member" },
            typeKeywords: ["cannotDiscuss"],
          },
          {
            id: "xyz",
            userMembership: { memberType: "member" },
            typeKeywords: [],
          },
        ],
      } as any;
      const channel = {
        allowReply: true,
        access: "private",
        allowAnonymous: false,
        groups: ["abc", "xyz"],
      } as any;

      expect(canCreateReply(channel, user)).toBe(true);
    });

    it("returns false if group authorized user attempts to create post in private-access channel, but the only group is marked cannotDiscuss", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      const user: IDiscussionsUser = {
        username: "Slughorn",
        groups: [
          {
            id: "abc",
            userMembership: { memberType: "member" },
            typeKeywords: ["cannotDiscuss"],
          },
        ],
      } as any;
      const channel = {
        allowReply: true,
        access: "private",
        allowAnonymous: false,
        groups: ["abc"],
      } as any;

      expect(canCreateReply(channel, user)).toBe(false);
    });

    it("returns false if group unauthorized user attempts to create post in private-access channel", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      const user: IDiscussionsUser = {
        username: "Slughorn",
        groups: [
          {
            id: "abc",
            userMembership: { memberType: "member" },
            typeKeywords: [],
          },
        ],
        typeKeywords: [],
      } as any;
      const channel = {
        allowReply: true,
        access: "private",
        allowAnonymous: false,
        groups: ["xyz"],
      } as any;

      expect(canCreateReply(channel, user)).toBe(false);
    });

    it("handles missing user/channel groups", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      const user: IDiscussionsUser = {
        username: "Slughorn",
      } as any;
      const channel = {
        allowReply: true,
        access: "private",
        allowAnonymous: false,
      } as any;

      expect(canCreateReply(channel, user)).toBe(false);
    });

    it("returns true if org authorized user attempts to create post in org-access channel", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      const user: IDiscussionsUser = {
        username: "Slughorn",
        orgId: "abc",
      } as any;
      const channel = {
        allowReply: true,
        access: "org",
        allowAnonymous: false,
        orgs: ["abc"],
      } as any;

      expect(canCreateReply(channel, user)).toBe(true);
    });

    it("returns false if unknown access value", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      const user: IDiscussionsUser = {
        username: "Slughorn",
        orgId: "abc",
      } as any;
      const channel = {
        allowReply: true,
        access: "foo",
        allowAnonymous: false,
        orgs: ["abc"],
      } as any;

      expect(canCreateReply(channel, user)).toBe(false);
    });
  });
});
