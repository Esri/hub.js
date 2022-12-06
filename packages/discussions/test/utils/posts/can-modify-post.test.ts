import { IGroup } from "@esri/arcgis-rest-types";
import {
  IChannel,
  IDiscussionsUser,
  IPost,
  SharingAccess,
} from "../../../src/types";
import { CANNOT_DISCUSS } from "../../../src/utils/constants";
import { canModifyPost } from "../../../src/utils/posts";

describe("canModifyPost", () => {
  it("returns false if the user did not create the post", () => {
    const post = { id: "postId", creator: "john" } as IPost;
    const user = { username: "notJohn" } as IDiscussionsUser;
    const channel = { access: SharingAccess.PUBLIC } as IChannel;

    const result = canModifyPost(post, user, channel);
    expect(result).toBe(false);
  });

  describe("Legacy Permissions", () => {
    describe("public channel", () => {
      it("returns true if user is creator", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = { username: "john" } as IDiscussionsUser;
        const channel = { access: SharingAccess.PUBLIC } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(true);
      });
    });

    describe("private channel", () => {
      it("returns true if user is creator and is a member of one of the channel groups", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [{ id: "bbb" }],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
          groups: ["bbb"],
        } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(true);
      });

      it("returns false if user is creator, is a member of one of the channel groups, but group is non-discussable", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [
            { id: "bbb", typeKeywords: [CANNOT_DISCUSS] },
          ] as any as IGroup[],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
          groups: ["bbb"],
        } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(false);
      });

      it("returns false if user is creator and is not a member of one of the channel groups", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          groups: [{ id: "bbb" }],
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
          groups: ["zzz"],
        } as IChannel; // user's group not included

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(false);
      });

      it("returns false if channel and user groups are empty", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.PRIVATE,
        } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(false);
      });
    });

    describe("org channel", () => {
      it("returns true if user is creator and is a member of one of the channel orgs", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          orgId: "ccc",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          orgs: ["ccc"],
        } as IChannel;

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(true);
      });

      it("returns false if user is creator and is not a member of one of the channel orgs", () => {
        const post = { id: "postId", creator: "john" } as IPost;
        const user = {
          username: "john",
          orgId: "ccc",
        } as IDiscussionsUser;
        const channel = {
          access: SharingAccess.ORG,
          orgs: ["zzz"],
        } as IChannel; // user's org not included

        const result = canModifyPost(post, user, channel);
        expect(result).toBe(false);
      });
    });
  });
});
