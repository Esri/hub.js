import * as hubCommon from "../src";

describe("index", () => {
  const expectedMembers = [
    "OperationStack",
    "OperationError",
    "HubError",
    "breakAssociation",
    "ASSOCIATION_REFERENCE_LIMIT",
    "getAssociatedEntitiesQuery",
    "getAssociationStats",
    "getAvailableToRequestEntitiesQuery",
    "getPendingEntitiesQuery",
    "getRequestingEntitiesQuery",
    "getReferencedEntityIds",
    "getWellKnownAssociationsCatalog",
    "getAvailableToRequestAssociationCatalogs",
    "setEntityAssociationGroup",
    "requestAssociation",
    "acceptAssociation",
    "canEditEvent",
    "canEditItem",
    "REQUIRED_PRIVS",
    "canEditSiteContent",
    "canEditSite",
    "hasBasePriv",
    "getHubApiUrl",
    "ArcGISContext",
    "ArcGISContextManager",
    "ALPHA_ORGS",
    "completeOAuth2",
    "categories",
    "isDownloadable",
    "UpdateFrequency",
    "getContentTypeIcon",
    "getPortalUrls",
    "getProxyUrl",
    "getLayerIdFromUrl",
    "isFeatureService",
    "isSiteType",
    "normalizeItemType",
    "getItemLayerId",
    "getItemHubId",
    "parseItemCategories",
    "getItemLayer",
    "isLayerView",
    "composeContent",
    "getFamily",
    "getFamilyTypes",
    "getCategory",
    "getTypes",
    "getTypeCategories",
    "getContentIdentifier",
    "itemToContent",
    "datasetToContent",
    "datasetToItem",
    "setContentType",
    "getContentTypeLabel",
    "getServiceStatus",
    "createContent",
    "updateContent",
    "deleteContent",
    "editorToContent",
    "fetchContent",
    "fetchHubContent",
    "composeHubContent",
    "modelToHubEditableContent",
    "HubContent",
    "enrichContentSearchResult",
    "parseDatasetId",
    "isSlug",
    "addContextToSlug",
    "removeContextFromSlug",
    "JobRecordType",
    "JobRecordStatus",
    "isHostedFeatureServiceMainItem",
    "isHostedFeatureServiceMainEntity",
    "isAGOFeatureServiceUrl",
    "isSecureProxyServiceUrl",
    "ServiceCapabilities",
    "hasServiceCapability",
    "toggleServiceCapability",
    "fetchItemJobRecords",
    "HUB_ENTITY_TYPES",
    "PublisherSource",
    "TIMELINE_STAGE_STATUSES",
    "isHubService",
    "ExpressionRelationships",
    "MetricVisibility",
    "MAX_ENTITY_METRICS_ALLOWED",
    "MAX_FEATURED_METRICS_ALLOWED",
    "EntityResourceMap",
    "EmbedKind",
    "validEntityEditorTypes",
    "validStatCardEditorTypes",
    "validFollowCardEditorTypes",
    "validEventGalleryCardEditorTypes",
    "validCardEditorTypes",
    "validEditorTypes",
    "UiSchemaRuleEffects",
    "UiSchemaElementTypes",
    "UiSchemaSectionTypes",
    "UiSchemaMessageTypes",
    "getEditorConfig",
    "ENTITY_NAME_SCHEMA",
    "SITE_ENTITY_NAME_SCHEMA",
    "ENTITY_SUMMARY_SCHEMA",
    "ENTITY_ACCESS_SCHEMA",
    "ENTITY_TAGS_SCHEMA",
    "ENTITY_CATEGORIES_SCHEMA",
    "ENTITY_IS_DISCUSSABLE_SCHEMA",
    "ENTITY_FEATURED_CONTENT_SCHEMA",
    "ENTITY_LOCATION_SCHEMA",
    "ENTITY_MAP_SCHEMA",
    "ENTITY_IMAGE_SCHEMA",
    "ENTITY_TIMELINE_SCHEMA",
    "PRIVACY_CONFIG_SCHEMA",
    "SLUG_SCHEMA",
    "PredicateSchema",
    "FilterSchema",
    "QuerySchema",
    "CollectionSchema",
    "GalleryDisplayConfigSchema",
    "CatalogSchema",
    "CollectionAppearanceSchema",
    "fetchHubEntity",
    "getTypeFromEntity",
    "getTypesFromEntityType",
    "getRelativeWorkspaceUrl",
    "isValidEntityType",
    "processActionLinks",
    "processActionLink",
    "setEntityAccess",
    "shareEntityWithGroups",
    "unshareEntityWithGroups",
    "getEntityGroups",
    "getEntityThumbnailUrl",
    "getHubTypeFromItemType",
    "getEntityTypeFromHubEntityType",
    "WGS84_WKID",
    "serializeSpatialReference",
    "buildExistingExportsPortalQuery",
    "getSpatialRefTypeKeyword",
    "getExportItemTypeKeyword",
    "getExportLayerTypeKeyword",
    "PORTAL_EXPORT_TYPES",
    "ServiceDownloadFormat",
    "DownloadOperationStatus",
    "ArcgisHubDownloadError",
    "fetchDownloadFile",
    "canUseCreateReplica",
    "canUseHubDownloadSystem",
    "canUseHubDownloadApi",
    "getHubDownloadApiFormats",
    "getDownloadConfiguration",
    "getDownloadFormats",
    "bBoxToExtent",
    "bboxToString",
    "createExtent",
    "extentToBBox",
    "GLOBAL_EXTENT",
    "orgExtent",
    "getOrgExtentAsBBox",
    "isBBox",
    "isValidExtent",
    "extentToPolygon",
    "getExtentCenter",
    "allCoordinatesPossiblyWGS84",
    "GeoJSONPolygonToBBox",
    "_unprotectAndRemoveGroup",
    "_consolidateResults",
    "_formatAutoAddResponse",
    "_processSecondaryEmail",
    "_processAutoAdd",
    "_processInvite",
    "_processPrimaryEmail",
    "_canEmailUser",
    "_getAutoAddUsers",
    "_getEmailUsers",
    "_getInviteUsers",
    "_isOrgAdmin",
    "addUsersToGroup",
    "enrichGroupSearchResult",
    "createHubGroup",
    "fetchHubGroup",
    "updateHubGroup",
    "deleteHubGroup",
    "HubGroup",
    "addGroupMembers",
    "getWellKnownGroup",
    "isOpenDataGroup",
    "autoAddUsers",
    "inviteUsers",
    "emailOrgUsers",
    "convertToWellKnownLocale",
    "fetchHubTranslation",
    "getCulture",
    "HUB_LOCALES",
    "HubInitiative",
    "createInitiative",
    "editorToInitiative",
    "updateInitiative",
    "fetchInitiative",
    "deleteInitiative",
    "convertItemToInitiative",
    "enrichInitiativeSearchResult",
    "getPendingProjectsQuery",
    "initiativeToCardModel",
    "initiativeResultToCardModel",
    "HubInitiativeTemplate",
    "createInitiativeTemplate",
    "updateInitiativeTemplate",
    "deleteInitiativeTemplate",
    "fetchInitiativeTemplate",
    "convertItemToInitiativeTemplate",
    "enrichInitiativeTemplateSearchResult",
    "initiativeTemplateToCardModel",
    "initiativeTemplateResultToCardModel",
    "CANNOT_DISCUSS",
    "MENTION_ATTRIBUTE",
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
    "searchChannels",
    "searchChannelsV2",
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
    "createSetting",
    "fetchSetting",
    "updateSetting",
    "removeSetting",
    "createSettingV2",
    "fetchSettingV2",
    "updateSettingV2",
    "removeSettingV2",
    "getDefaultEntitySettings",
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
    "createDiscussion",
    "updateDiscussion",
    "deleteDiscussion",
    "fetchDiscussion",
    "convertItemToDiscussion",
    "HubDiscussion",
    "HubSurvey",
    "updateSurvey",
    "deleteSurvey",
    "fetchSurvey",
    "convertItemToSurvey",
    "MAP_SURVEY_TYPEKEYWORD",
    "decodeForm",
    "getFormInfoJson",
    "getFormJson",
    "getInputFeatureServiceModel",
    "getMapQuestion",
    "getS123EditUrl",
    "getS123ShareUrl",
    "getSourceFeatureServiceModelFromFieldworker",
    "getStakeholderModel",
    "getSurveyModels",
    "hasMapQuestion",
    "isDraft",
    "isFieldworkerView",
    "isMapQuestion",
    "isPageQuestion",
    "isSurvey123Connect",
    "setDisplayMapKeyword",
    "shouldDisplayMap",
    "createHubEvent",
    "updateHubEvent",
    "deleteHubEvent",
    "createHubEventRegistration",
    "deleteHubEventRegistration",
    "fetchEvent",
    "convertClientEventToHubEvent",
    "HubEvent",
    "HubEventAttendanceType",
    "HubEventCapacityType",
    "getEventGroups",
    "_unprotectAndRemoveItem",
    "applyPropertiesToItems",
    "deleteProp",
    "failSafeUpdate",
    "getModelFromOptions",
    "interpolate",
    "interpolateItemId",
    "replaceItemId",
    "shareItemToGroups",
    "unprotectModel",
    "unshareItemFromGroups",
    "doesItemExistWithTitle",
    "getUniqueItemTitle",
    "fetchAllPages",
    "STANDARD_LICENSES",
    "getStructuredLicense",
    "constructSlug",
    "setSlugKeyword",
    "getItemBySlug",
    "findItemsBySlug",
    "getUniqueSlug",
    "itemPropsNotInTemplates",
    "normalizeSolutionTemplateItem",
    "setItemThumbnail",
    "registerBrowserApp",
    "createItemFromFile",
    "createItemFromUrl",
    "createItemFromUrlOrFile",
    "uploadImageResource",
    "isServicesDirectoryDisabled",
    "getItemIdentifier",
    "deleteItemThumbnail",
    "getEntityFollowersGroupId",
    "isUserFollowing",
    "followEntity",
    "unfollowEntity",
    "fetchItem",
    "getModel",
    "getModelBySlug",
    "createModel",
    "updateModel",
    "upsertModelResources",
    "fetchModelFromItem",
    "fetchModelResources",
    "serializeModel",
    "subscribe",
    "createSubscription",
    "getSubscriptions",
    "getSubscription",
    "updateSubscription",
    "createUser",
    "getUser",
    "updateUser",
    "deleteUser",
    "NewsletterCadence",
    "DeliveryMethod",
    "ICreateEventMetadata",
    "ICreateTelemetryReportMetadata",
    "INotificationSpec",
    "ISubscribeMetadata",
    "ISubscription",
    "ISubscriptionMetadata",
    "IUser",
    "SystemNotificationSpecNames",
    "SubscriptionAction",
    "notify",
    "ISchedulerSubscriptionMetadata",
    "ISubscriptionCatalog",
    "ISchedulerUser",
    "ISchedulerNotificationSpec",
    "SchedulerDeliveryMethod",
    "ISchedulerSubscription",
    "SchedulerSystemNotificationSpecNames",
    "SubscriptionEntityType",
    "SchedulerCadence",
    "SchedulerSubscriptionAction",
    "INotify",
    "_deepMapValues",
    "_isString",
    "_isDate",
    "_isFunction",
    "_isObject",
    "_isRegExp",
    "_mapValues",
    "deepSet",
    "ensureProp",
    "getProp",
    "getProps",
    "getWithDefault",
    "removeEmptyProps",
    "deepStringReplace",
    "mergeObjects",
    "setProp",
    "deepFilter",
    "deepFindById",
    "deepFind",
    "resolveReferences",
    "pickProps",
    "deepEqual",
    "deepDeletePropByValue",
    "fetchOrg",
    "fetchOrgLimits",
    "fetchMaxNumUserGroupsLimit",
    "fetchOrganization",
    "organizationToSearchResult",
    "portalToOrganization",
    "createPage",
    "updatePage",
    "fetchPage",
    "convertModelToPage",
    "convertItemToPage",
    "deletePage",
    "enrichPageSearchResult",
    "HubPage",
    "HubPermissionsPolicies",
    "getPermissionPolicy",
    "checkPermission",
    "addPermissionPolicy",
    "removePermissionPolicy",
    "isPermission",
    "HubProject",
    "createProject",
    "editorToProject",
    "updateProject",
    "deleteProject",
    "fetchProject",
    "convertItemToProject",
    "enrichProjectSearchResult",
    "projectToCardModel",
    "projectResultToCardModel",
    "RemoteServerError",
    "hubApiRequest",
    "_addTokenToResourceUrl",
    "convertSolutionTemplateResourcesToAssets",
    "fetchAndUploadResource",
    "fetchAndUploadThumbnail",
    "fetchImageAsBlob",
    "getItemAssets",
    "getItemThumbnailUrl",
    "getOrgThumbnailUrl",
    "stringToBlob",
    "uploadResourcesFromUrl",
    "addSolutionResourceUrlToAssets",
    "objectToJsonBlob",
    "validateUrl",
    "upsertResource",
    "removeResource",
    "doesResourceExist",
    "isService",
    "Catalog",
    "Collection",
    "hubSearch",
    "serializeQueryForPortal",
    "targetEntities",
    "upgradeCatalogSchema",
    "SEARCH_APIS",
    "expandApis",
    "expandApi",
    "valueToMatchOptions",
    "relativeDateToDateRange",
    "getNextFunction",
    "getGroupThumbnailUrl",
    "getUserThumbnailUrl",
    "migrateToCollectionKey",
    "getScopeGroupPredicate",
    "getGroupPredicate",
    "getResultSiteRelativeLink",
    "addDefaultItemSearchPredicates",
    "getKilobyteSizeOfQuery",
    "expandPortalQuery",
    "dotifyString",
    "getWellKnownCatalog",
    "getWellknownCollections",
    "getWellknownCollection",
    "_ensureTelemetry",
    "_migrateFeedConfig",
    "_migrateEventListCardConfigs",
    "_migrateTelemetryConfig",
    "migrateBadBasemap",
    "_migrateLinkUnderlinesCapability",
    "migrateWebMappingApplicationSites",
    "_checkStatusAndParseJson",
    "_getAuthHeader",
    "_getDomainServiceUrl",
    "_lookupPortal",
    "addDomain",
    "domainExists",
    "domainExistsPortal",
    "getDomainsForSite",
    "getUniqueDomainName",
    "getUniqueDomainNamePortal",
    "isDomainForLegacySite",
    "isDomainUsedElsewhere",
    "isValidDomain",
    "lookupDomain",
    "removeDomain",
    "removeDomainsBySiteId",
    "updateDomain",
    "_ensureSafeDomainLength",
    "ensureUniqueDomainName",
    "addSiteDomains",
    "removeDomainByHostname",
    "buildDraft",
    "fetchSiteModel",
    "getSiteById",
    "HubSite",
    "HUB_SITE_ITEM_TYPE",
    "ENTERPRISE_SITE_ITEM_TYPE",
    "createSite",
    "updateSite",
    "deleteSite",
    "fetchSite",
    "convertModelToSite",
    "convertItemToSite",
    "enrichSiteSearchResult",
    "SITE_SCHEMA_VERSION",
    "DEFAULT_THEME",
    "getOrgDefaultTheme",
    "upgradeSiteSchema",
    "getFeedConfiguration",
    "setFeedConfiguration",
    "reharvestSiteCatalog",
    "getFeedTemplate",
    "setFeedTemplate",
    "previewFeed",
    "getCatalogFromSiteModel",
    "HubTemplate",
    "templateToCardModel",
    "templateResultToCardModel",
    "fetchTemplate",
    "convertItemToTemplate",
    "enrichTemplateSearchResult",
    "createTemplate",
    "updateTemplate",
    "editorToTemplate",
    "deleteTemplate",
    "HubFamilies",
    "FileExtension",
    "ItemType",
    "addCreateItemTypes",
    "HubEntityStatus",
    "HubEntityHero",
    "isMapOrFeatureServerUrl",
    "getServiceTypeFromUrl",
    "buildUrl",
    "getHubLocaleAssetUrl",
    "getPortalApiUrl",
    "getPortalUrl",
    "HUB_CDN_URLMAP",
    "upgradeProtocol",
    "stripProtocol",
    "_getHttpAndHttpsUris",
    "_getLocation",
    "getHubApiUrlFromPortal",
    "getHubUrlFromPortal",
    "getItemHomeUrl",
    "getItemApiUrl",
    "getItemDataUrl",
    "convertUrlsToAnchorTags",
    "getHubApiFromPortalUrl",
    "getPortalBaseFromOrgUrl",
    "getContentHomeUrl",
    "getGroupHomeUrl",
    "getUserHomeUrl",
    "getCampaignUrl",
    "isSafeRedirectUrl",
    "cacheBustUrl",
    "getCdnAssetUrl",
    "convertUserToHubUser",
    "enrichUserSearchResult",
    "fetchHubUser",
    "userResultToCardModel",
    "cloneObject",
    "arrayToObject",
    "objectToArray",
    "findBy",
    "without",
    "compose",
    "createId",
    "maybeAdd",
    "maybePush",
    "camelize",
    "unique",
    "uniqueBy",
    "last",
    "filterBy",
    "extend",
    "addDays",
    "chunkArray",
    "isNil",
    "capitalize",
    "flattenArray",
    "asyncForEach",
    "batch",
    "unicodeToBase64",
    "base64ToUnicode",
    "ensureUniqueString",
    "createOperationPipeline",
    "failSafe",
    "generateRandomString",
    "getHubProduct",
    "getSubscriptionType",
    "includes",
    "isGuid",
    "isCuid",
    "mapBy",
    "slugify",
    "withoutByProp",
    "propifyString",
    "incrementString",
    "Level",
    "Logger",
    "isUpdateGroup",
    "runRevertableTask",
    "processRevertableTasks",
    "dasherize",
    "titleize",
    "memoize",
    "clearMemoizedCache",
    "getEnvironmentFromPortalUrl",
    "poll",
    "updateUserSiteSettings",
    "fetchUserSiteSettings",
    "updateUserHubSettings",
    "fetchUserHubSettings",
    "getObjectSize",
    "getDatePickerDate",
    "getTimePickerTime",
    "guessTimeZone",
    "isComboboxItemSelected",
    "wait",
    "createVersion",
    "deleteVersion",
    "getVersion",
    "searchVersions",
    "updateVersion",
    "updateVersionMetadata",
    "applyVersion",
    "checkForStaleVersion",
    "getEntityMetrics",
    "resolveMetric",
    "aggregateMetrics",
    "editorToMetric",
    "buildWhereClause",
    "updateHubEntity",
    "getCardModelUrlFromResult",
    "getCardModelUrlFromEntity",
    "EntityEditor",
    "explainQueryResult",
    "getAddContentConfig",
    "getCatalogGroups",
    "getPredicateValues",
    "getUserGroupsByMembership",
    "getUserGroupsFromQuery",
    "negateGroupPredicates",
    "searchCatalogs",
    "searchEntityCatalogs",
    "addHistoryEntry",
    "removeHistoryEntry",
    "deepCatalogContains",
    "pathMap",
    "getPathForHubEntityType",
    "getHubEntityTypeFromPath",
    "parseContainmentPath",
    "catalogContains",
    "btoa",
    "atob",
  ];
  const exportedMembers = Object.keys(hubCommon);

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
