import * as discussions from "../../src/discussions";

describe("discussions index", () => {
  const expectedMembers = [
    // existing exports before moving things from hub-discussions into hub-common
    "HubDiscussion",
    "createDiscussion",
    "updateDiscussion",
    "deleteDiscussion",
    "fetchDiscussion",
    "convertItemToDiscussion",
    "CANNOT_DISCUSS",
    "isDiscussable",
    "setDiscussableKeyword",
    "isPublicChannel",
    "isOrgChannel",
    "isPrivateChannel",
    "getChannelAccess",
    "getChannelOrgIds",
    "getChannelGroupIds",
    "getChannelUsersQuery",
    "channelToSearchResult",
    "getPostCSVFileName",
    "searchChannelsV2",
    "createSettingV2",
    "fetchSettingV2",
    "updateSettingV2",
    "removeSettingV2",
    "getDefaultEntitySettings",
    "SortOrder",
    "PostReaction",
    "SharingAccess",
    "PostStatus",
    "DiscussionType",
    "DiscussionSource",
    "PostRelation",
    "ReactionRelation",
    "ChannelFilter",
    "CommonSort",
    "SearchPostsFormat",
    "Role",
    "PostSort",
    "PostType",
    "ChannelSort",
    "ChannelRelation",
    "AclCategory",
    "AclSubCategory",
    "EntitySettingType",
    "discussionsApiRequest",
    "discussionsApiRequestV2",

    // new exports after moving things from hub-discussions into hub-common
    "MENTION_ATTRIBUTE",
    "createChannelV2",
    "fetchChannelV2",
    "updateChannelV2",
    "removeChannelV2",
    "fetchChannelNotifcationOptOutV2",
    "createChannelNotificationOptOutV2",
    "removeChannelNotificationOptOutV2",
    "removeChannelActivityV2",
    "searchPostsV2",
    "exportPostsV2",
    "createPostV2",
    "createReplyV2",
    "fetchPostV2",
    "removePostV2",
    "updatePostV2",
    "updatePostStatusV2",
    "createReactionV2",
    "removeReactionV2",
    "canCreateChannelV2",
    "canDeleteChannelV2",
    "canEditChannelV2",
    "canReadChannelV2",
    "parseDiscussionURI",
    "parseMentionedUsers",
    "canCreatePostV2",
    "canCreateReplyV2",
    "canDeletePostV2",
    "canEditPostStatusV2",
    "canEditPostV2",
    "canCreateReactionV2",
    "reduceByGroupMembership",
    "isOrgAdmin",
    "isUserInOrg",
    "isOrgAdminInOrg",
    "userHasPrivilege",
    "userHasPrivileges",
  ];
  const exportedMembers = Object.keys(discussions);

  it("should export the expected number of artifacts", () => {
    expect(exportedMembers.length).toEqual(expectedMembers.length);
  });

  it("should not add any unexpected exports", () => {
    const added = exportedMembers.filter(
      (exportedMember) => !expectedMembers.includes(exportedMember)
    );
    expect(added).toEqual([]);
  });

  it("should not unexpectedly remove any exports", () => {
    const removed = expectedMembers.filter(
      (expectedMember) => !exportedMembers.includes(expectedMember)
    );
    expect(removed).toEqual([]);
  });
});
