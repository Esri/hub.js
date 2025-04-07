import {
  IChannel,
  IDiscussionsUser,
} from "../../../../../src/discussions/api//types";
import { canCreatePost } from "../../../../../src/discussions/api//utils/posts/can-create-post";
import * as portalPrivModule from "../../../../../src/discussions/api//utils/portal-privilege";

describe("canCreatePost", () => {
  let hasOrgAdminUpdateRightsSpy: jasmine.Spy;

  beforeAll(() => {
    hasOrgAdminUpdateRightsSpy = spyOn(
      portalPrivModule,
      "hasOrgAdminUpdateRights"
    );
  });

  beforeEach(() => {
    hasOrgAdminUpdateRightsSpy.calls.reset();
  });

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminUpdateRights returns true", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => true);

      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa", allowPost: false } as IChannel; // bypass channel setting check

      expect(canCreatePost(channel, user)).toBe(true);

      expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);
    });
  });

  describe("with legacy permissions", () => {
    it("returns false if undefined user attempts to create post in public allowAnonymous === true channel", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      const user: IDiscussionsUser = undefined;
      const channel = {
        allowPost: true,
        allowAnonymous: true,
        access: "public",
      } as IChannel;

      expect(canCreatePost(channel, user)).toBe(false);
    });

    it("returns false if anonymous user attempts to create post in public allowAnonymous === true channel", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      const user: IDiscussionsUser = { username: null };
      const channel = {
        allowPost: true,
        allowAnonymous: true,
        access: "public",
      } as IChannel;

      expect(canCreatePost(channel, user)).toBe(false);
    });

    it("returns false if anonymous user attempts to create post in public allowAnonymous === false channel", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      const user: IDiscussionsUser = { username: null };
      const channel = {
        allowPost: true,
        allowAnonymous: false,
        access: "public",
      } as IChannel;

      expect(canCreatePost(channel, user)).toBe(false);
    });

    it("returns true if authenticated user attempts to create post in public-access channel", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      const user: IDiscussionsUser = { username: "Slughorn" };
      const channel = {
        allowPost: true,
        access: "public",
        allowAnonymous: false,
      } as IChannel;

      expect(canCreatePost(channel, user)).toBe(true);
    });

    it("returns true if group authorized user attempts to create post in private-access channel", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
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
        allowPost: true,
        access: "private",
        allowAnonymous: false,
        groups: ["abc"],
      } as any;

      expect(canCreatePost(channel, user)).toBe(true);
    });

    it("returns true if a group authorized user attempts to create post in private-access channel, but at least one group is NOT marked cannotDiscuss", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
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
        allowPost: true,
        access: "private",
        allowAnonymous: false,
        groups: ["abc", "xyz"],
      } as any;

      expect(canCreatePost(channel, user)).toBe(true);
    });

    it("returns false if group authorized user attempts to create post in private-access channel, but the only group is marked cannotDiscuss", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
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
        allowPost: true,
        access: "private",
        allowAnonymous: false,
        groups: ["abc"],
      } as any;

      expect(canCreatePost(channel, user)).toBe(false);
    });

    it("returns false if group unauthorized user attempts to create post in private-access channel", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
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
        allowPost: true,
        access: "private",
        allowAnonymous: false,
        groups: ["xyz"],
      } as any;

      expect(canCreatePost(channel, user)).toBe(false);
    });

    it("handles missing user/channel groups", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      const user: IDiscussionsUser = {
        username: "Slughorn",
      } as any;
      const channel = {
        allowPost: true,
        access: "private",
        allowAnonymous: false,
      } as any;

      expect(canCreatePost(channel, user)).toBe(false);
    });

    it("returns true if org authorized user attempts to create post in org-access channel", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      const user: IDiscussionsUser = {
        username: "Slughorn",
        orgId: "abc",
      } as any;
      const channel = {
        allowPost: true,
        access: "org",
        allowAnonymous: false,
        orgs: ["abc"],
      } as any;

      expect(canCreatePost(channel, user)).toBe(true);
    });

    it("returns false if unknown access value", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      const user: IDiscussionsUser = {
        username: "Slughorn",
        orgId: "abc",
      } as any;
      const channel = {
        allowPost: true,
        access: "foo",
        allowAnonymous: false,
        orgs: ["abc"],
      } as any;

      expect(canCreatePost(channel, user)).toBe(false);
    });
  });
});
