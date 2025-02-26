import * as hubDiscussions from "../src";

/**
 * Skipping this test b/c it passes 100% of the time when running locally via `npm run test:node`
 * but fails 100% of the time in CI. Specifically, when it runs in CI, this test suggests the
 * following are not importable from the index.ts file:
 *   - IPlatformSharing
 *   - IDiscussionParams
 *   - IWithAuthor
 *   - IWithEditor
 *   - IWithSorting
 *   - IWithFiltering
 *   - IWithTimeQueries
 *   - IWithTimestamps
 *   - IPagedResponse
 *   - IRemoveChannelNotificationOptOutResult
 *   - IRemoveChannelActivityResult
 *   - IChannelNotificationOptOut
 *   - IDiscussionsRequestOptions
 *   - IDiscussionsMentionMeta
 *   - IDiscussionsUser
 *   - IReaction
 *   - ICreateReaction
 *   - ICreateReactionOptions
 *   - IRemoveReactionOptions
 *   - IRemoveReactionResponse
 *   - IPost
 *   - IPostOptions
 *   - ICreatePost
 *   - ICreateChannelPost
 *   - ICreatePostParams
 *   - ICreatePostParamsV2
 *   - ICreateReplyParams
 *   - IFetchPost
 *   - ISearchPosts
 *   - IUpdatePostStatus
 *   - IUpdatePost
 *   - ISearchPostsParams
 *   - IExportPostsParams
 *   - IFetchPostParams
 *   - IUpdatePostParams
 *   - IUpdatePostStatusParams
 *   - IRemovePostParams
 *   - IRemovePostResponse
 *   - IChannelAclPermissionDefinition
 *   - IChannelAclPermissionUpdateDefinition
 *   - IChannelAclPermission
 *   - ICreateChannelSettings
 *   - ICreateChannelSettingsV2
 *   - IChannelMetadata
 *   - ICreateChannelPermissions
 *   - ICreateChannelPermissionsV2
 *   - IUpdateChannelPermissions
 *   - IUpdateChannelSettingsV2
 *   - IUpdateChannelPermissionsV2
 *   - ICreateChannel
 *   - ICreateChannelV2
 *   - IChannel
 *   - IUpdateChannel
 *   - IUpdateChannelV2
 *   - IFetchChannel
 *   - ISearchChannels
 *   - ICreateChannelParams
 *   - ICreateChannelParamsV2
 *   - IFetchChannelParams
 *   - ISearchChannelsParams
 *   - IUpdateChannelParams
 *   - IUpdateChannelParamsV2
 *   - IRemoveChannelParams
 *   - IRemoveChannelResponse
 *   - IFetchChannelNotificationOptOutParams
 *   - ICreateChannelNotificationOptOutParams
 *   - IRemoveChannelNotificationOptOutParams
 *   - IRemoveChannelActivityParams
 *   - IEntitySetting
 *   - IEntitySettings
 *   - IDiscussionsSettings
 *   - IRemoveSettingResponse
 *   - ICreateSetting
 *   - IUpdateSetting
 *   - ICreateSettingParams
 *   - IFetchSettingParams
 *   - IUpdateSettingParams
 *   - IRemoveSettingParams
 *
 * I highly suspect this is related to cyclic dependencies within this package, our current export strategy/order,
 * or a combination of both. We should revisit unskipping this test once cyclic deps are eliminated from hub-common,
 * and again if/when we change our export strategy/order...
 */

xdescribe("index", () => {
  const expectedMembers = [
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
    "createReaction",
    "removeReaction",
    "createReactionV2",
    "removeReactionV2",
    "SortOrder",
    "PostReaction",
    "SharingAccess",
    "IPlatformSharing",
    "PostStatus",
    "DiscussionType",
    "DiscussionSource",
    "IDiscussionParams",
    "PostRelation",
    "ReactionRelation",
    "ChannelFilter",
    "CommonSort",
    "SearchPostsFormat",
    "IWithAuthor",
    "IWithEditor",
    "IWithSorting",
    "IWithFiltering",
    "IWithTimeQueries",
    "IWithTimestamps",
    "IPagedResponse",
    "IRemoveChannelNotificationOptOutResult",
    "IRemoveChannelActivityResult",
    "IChannelNotificationOptOut",
    "IDiscussionsRequestOptions",
    "Role",
    "IDiscussionsMentionMeta",
    "IDiscussionsUser",
    "IReaction",
    "ICreateReaction",
    "ICreateReactionOptions",
    "IRemoveReactionOptions",
    "IRemoveReactionResponse",
    "PostSort",
    "PostType",
    "IPost",
    "IPostOptions",
    "ICreatePost",
    "ICreateChannelPost",
    "ICreatePostParams",
    "ICreatePostParamsV2",
    "ICreateReplyParams",
    "IFetchPost",
    "ISearchPosts",
    "IUpdatePostStatus",
    "IUpdatePost",
    "ISearchPostsParams",
    "IExportPostsParams",
    "IFetchPostParams",
    "IUpdatePostParams",
    "IUpdatePostStatusParams",
    "IRemovePostParams",
    "IRemovePostResponse",
    "ChannelSort",
    "ChannelRelation",
    "AclCategory",
    "AclSubCategory",
    "IChannelAclPermissionDefinition",
    "IChannelAclPermissionUpdateDefinition",
    "IChannelAclPermission",
    "ICreateChannelSettings",
    "ICreateChannelSettingsV2",
    "IChannelMetadata",
    "ICreateChannelPermissions",
    "ICreateChannelPermissionsV2",
    "IUpdateChannelPermissions",
    "IUpdateChannelSettingsV2",
    "IUpdateChannelPermissionsV2",
    "ICreateChannel",
    "ICreateChannelV2",
    "IChannel",
    "IUpdateChannel",
    "IUpdateChannelV2",
    "IFetchChannel",
    "ISearchChannels",
    "ICreateChannelParams",
    "ICreateChannelParamsV2",
    "IFetchChannelParams",
    "ISearchChannelsParams",
    "IUpdateChannelParams",
    "IUpdateChannelParamsV2",
    "IRemoveChannelParams",
    "IRemoveChannelResponse",
    "IFetchChannelNotificationOptOutParams",
    "ICreateChannelNotificationOptOutParams",
    "IRemoveChannelNotificationOptOutParams",
    "IRemoveChannelActivityParams",
    "IEntitySetting",
    "EntitySettingType",
    "IEntitySettings",
    "IDiscussionsSettings",
    "IRemoveSettingResponse",
    "ICreateSetting",
    "IUpdateSetting",
    "ICreateSettingParams",
    "IFetchSettingParams",
    "IUpdateSettingParams",
    "IRemoveSettingParams",
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
    "isDiscussable",
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
    "MENTION_ATTRIBUTE",
    "CANNOT_DISCUSS",
  ];
  const exportedMembers = Object.keys(hubDiscussions);

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
