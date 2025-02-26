import * as discussions from "../../src/discussions";

describe("discussions index", () => {
  const expectedMembers = [
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
