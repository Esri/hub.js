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
    "searchChannels",
    "searchChannelsV2",
    "createSetting",
    "fetchSetting",
    "updateSetting",
    "removeSetting",
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
    "createChannel",
    "fetchChannel",
    "updateChannel",
    "removeChannel",
    "fetchChannelNotifcationOptOut",
    "createChannelNotificationOptOut",
    "removeChannelNotificationOptOut",
    "removeChannelActivity",
    "createChannelV2",
    "fetchChannelV2",
    "updateChannelV2",
    "removeChannelV2",
    "fetchChannelNotifcationOptOutV2",
    "createChannelNotificationOptOutV2",
    "removeChannelNotificationOptOutV2",
    "removeChannelActivityV2",
    "searchPosts",
    "exportPosts",
    "createPost",
    "createReply",
    "fetchPost",
    "removePost",
    "updatePost",
    "updatePostStatus",
    "searchPostsV2",
    "exportPostsV2",
    "createPostV2",
    "createReplyV2",
    "fetchPostV2",
    "removePostV2",
    "updatePostV2",
    "updatePostStatusV2",
    "createReaction",
    "removeReaction",
    "createReactionV2",
    "removeReactionV2",
    "canCreateChannel",
    "canDeleteChannel",
    "canEditChannel",
    "canModifyChannel",
    "canPostToChannel",
    "canReadChannel",
    "canReadFromChannel",
    "canCreateChannelV2",
    "canDeleteChannelV2",
    "canEditChannelV2",
    "canReadChannelV2",
    "canCreatePost",
    "canCreateReply",
    "canDeletePost",
    "canModifyPostStatus",
    "canEditPostStatus",
    "canModifyPost",
    "canEditPost",
    "parseDiscussionURI",
    "parseMentionedUsers",
    "canCreatePostV2",
    "canCreateReplyV2",
    "canDeletePostV2",
    "canEditPostStatusV2",
    "canEditPostV2",
    "canCreateReaction",
    "canCreateReactionV2",
    "reduceByGroupMembership",
    "isOrgAdmin",
    "isUserInOrg",
    "isOrgAdminInOrg",
    "userHasPrivilege",
    "userHasPrivileges",
    "deriveUserRoleV2",
    "cannotCreatePostGroupsBlockedV2",
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
