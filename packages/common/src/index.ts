/* Copyright (c) 2024 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/* istanbul ignore file */
import OperationStack from "./OperationStack";
import OperationError from "./OperationError";
import HubError from "./HubError";

export {
  bboxToString,
  isBBox,
  isOrgAdmin,
  getUser,
  updateUser,
  createItem,
  updateItem,
  commitItemUpload,
  getPortalUrl,
} from "@esri/arcgis-rest-portal";
export { deepEqual } from "assert";
export { canEditEvent } from "./access/can-edit-event";
export { canEditItem } from "./access/can-edit-item";
export { canEditSite } from "./access/can-edit-site";
export {
  REQUIRED_PRIVS,
  canEditSiteContent,
} from "./access/can-edit-site-content";
export { compareAccess } from "./access/compareAccess";
export { hasBasePriv } from "./access/has-base-priv";
export { getHubApiUrl } from "./api";
export {
  ENTERPRISE_SITES_PATH,
  ENTERPRISE_HOME_SUBDOMAIN,
  ArcGISContext,
} from "./ArcGISContext";
export {
  ArcGISContextManager,
  HUB_SERVICE_STATUS,
  ENTERPRISE_SITES_SERVICE_STATUS,
  ALPHA_ORGS,
} from "./ArcGISContextManager";
export { breakAssociation } from "./associations/breakAssociation";
export { getAssociatedEntitiesQuery } from "./associations/getAssociatedEntitiesQuery";
export { getAssociationStats } from "./associations/getAssociationStats";
export { getAvailableToRequestEntitiesQuery } from "./associations/getAvailableToRequestEntitiesQuery";
export { getPendingEntitiesQuery } from "./associations/getPendingEntitiesQuery";
export { getReferencedEntityIds } from "./associations/getReferencedEntityIds";
export { getRequestingEntitiesQuery } from "./associations/getRequestingEntitiesQuery";
// Note: we expose "requestAssociation" under 2 names.
// These actions are functionally equivalent, but we want
// to make the intent more clear to the consumer.
export {
  requestAssociation,
  requestAssociation as acceptAssociation,
} from "./associations/requestAssociation";
export { setEntityAssociationGroup } from "./associations/setEntityAssociationGroup";
export { ASSOCIATION_REFERENCE_LIMIT } from "./associations/types";
export {
  getWellKnownAssociationsCatalog,
  getAvailableToRequestAssociationCatalogs,
} from "./associations/wellKnownAssociationCatalogs";
export { categories, isDownloadable } from "./categories";
export {
  createHubChannel,
  updateHubChannel,
  deleteHubChannel,
} from "./channels/edit";
export { fetchHubChannel } from "./channels/fetch";
export { HubChannel } from "./channels/HubChannel";
export {
  UpdateFrequency,
  getContentTypeIcon,
  getPortalUrls,
  getProxyUrl,
  getLayerIdFromUrl,
  isFeatureService,
  normalizeItemType,
  getItemLayerId,
  getItemHubId,
  parseItemCategories,
  getItemLayer,
  isLayerView,
  composeContent,
} from "./content/compose";
export { composeHubContent } from "./content/composeHubContent";
export {
  getCategory,
  getTypes,
  getTypeCategories,
  getContentIdentifier,
  itemToContent,
  datasetToContent,
  datasetToItem,
  setContentType,
  getContentTypeLabel,
  getServiceStatus,
} from "./content/contentUtils";
export {
  createContent,
  updateContent,
  deleteContent,
  editorToContent,
} from "./content/edit";
export { fetchContent } from "./content/fetchContent";
export {
  fetchHubContent,
  convertItemToContent,
} from "./content/fetchHubContent";
export { fetchItemJobRecords } from "./content/fetchItemJobRecords";
export { getFamily, getFamilyTypes } from "./content/get-family";
export {
  isHostedFeatureServiceMainItem,
  isHostedFeatureServiceMainEntity,
  isAGOFeatureServiceUrl,
  isSecureProxyServiceUrl,
  ServiceCapabilities,
  hasServiceCapability,
  toggleServiceCapability,
} from "./content/hostedServiceUtils";
export { HubContent } from "./content/HubContent";
export { isSiteType } from "./content/isSiteType";
export { modelToHubEditableContent } from "./content/modelToHubEditableContent";
export {
  enrichContentSearchResult,
  enrichImageSearchResult,
} from "./content/search";
export {
  parseDatasetId,
  isSlug,
  addContextToSlug,
  removeContextFromSlug,
} from "./content/slugs";
export { JobRecordType, JobRecordStatus } from "./content/types";
export { catalogContains } from "./core/catalogContains";
export { deepCatalogContains } from "./core/deepCatalogContains";
export { EntityEditor } from "./core/EntityEditor";
export { fetchHubEntity } from "./core/fetchHubEntity";
export { getEntityGroups } from "./core/getEntityGroups";
export { getEntityThumbnailUrl } from "./core/getEntityThumbnailUrl";
export { getEntityTypeFromHubEntityType } from "./core/getEntityTypeFromHubEntityType";
export { getHubTypeFromItemType } from "./core/getHubTypeFromItemType";
export { getRelativeWorkspaceUrl } from "./core/getRelativeWorkspaceUrl";
export { getTypeFromEntity } from "./core/getTypeFromEntity";
export { getTypesFromEntityType } from "./core/getTypesFromEntityType";
export { addHistoryEntry, removeHistoryEntry } from "./core/hubHistory";
export { isValidEntityType } from "./core/isValidEntityType";
export {
  pathMap,
  getPathForHubEntityType,
  getHubEntityTypeFromPath,
  parseContainmentPath,
} from "./core/parseContainmentPath";
export {
  processActionLinks,
  processActionLink,
} from "./core/processActionLinks";
export { getEditorConfig } from "./core/schemas/getEditorConfig";
export { fetchCategoriesUiSchemaElement } from "./core/schemas/internal/fetchCategoriesUiSchemaElement";
export { getTagItems } from "./core/schemas/internal/getTagItems";
export {
  GalleryDisplayConfigSchema,
  PredicateSchema,
  FilterSchema,
  QuerySchema,
  CollectionSchema,
  CatalogSchema,
} from "./core/schemas/shared/CatalogSchema";
export {
  ENTITY_NAME_SCHEMA,
  SITE_ENTITY_NAME_SCHEMA,
  ENTERPRISE_SITE_ENTITY_NAME_SCHEMA,
  ENTITY_SUMMARY_SCHEMA,
  ENTITY_ACCESS_SCHEMA,
  ENTITY_TAGS_SCHEMA,
  ENTITY_CATEGORIES_SCHEMA,
  ENTITY_IS_DISCUSSABLE_SCHEMA,
  DISCUSSION_SETTINGS_SCHEMA,
  ENTITY_FEATURED_CONTENT_SCHEMA,
  ENTITY_LOCATION_SCHEMA,
  ENTITY_MAP_SCHEMA,
  ENTITY_IMAGE_SCHEMA,
  ENTITY_TIMELINE_SCHEMA,
  ENTITY_LAYOUT_SETUP_SCHEMA,
  PRIVACY_CONFIG_SCHEMA,
  SLUG_SCHEMA,
  ENTITY_CATALOG_SETUP_SCHEMA,
} from "./core/schemas/shared/subschemas";
export {
  validEntityEditorTypes,
  validStatCardEditorTypes,
  validFollowCardEditorTypes,
  validEventGalleryCardEditorTypes,
  validEmbedCardEditorTypes,
  validDiscussionSettingsEditorTypes,
  validCardEditorTypes,
  validEditorTypes,
  UiSchemaRuleEffects,
  UiSchemaElementTypes,
  UiSchemaSectionTypes,
  UiSchemaMessageTypes,
} from "./core/schemas/types";
export { setEntityAccess } from "./core/setEntityAccess";
export { shareEntityWithGroups } from "./core/shareEntityWithGroups";
export { EmbedKind } from "./core/types/Embeds";
export {
  HUB_ITEM_ENTITY_TYPES,
  HUB_ENTITY_TYPES,
} from "./core/types/HubEntityType";
export { PublisherSource } from "./core/types/IHubContent";
export { FeatureLayerStyle } from "./core/types/IHubMapSettings";
export { TIMELINE_STAGE_STATUSES } from "./core/types/IHubTimeline";
export { isHubService } from "./core/types/ISystemStatus";
export {
  ExpressionRelationships,
  MetricVisibility,
  MAX_ENTITY_METRICS_ALLOWED,
  MAX_FEATURED_METRICS_ALLOWED,
} from "./core/types/Metrics";
export { EntityResourceMap } from "./core/types/types";
export { unshareEntityWithGroups } from "./core/unshareEntityWithGroups";
export { updateHubEntity } from "./core/updateHubEntity";
export {
  searchChannels,
  searchChannelsV2,
  createChannel,
  fetchChannel,
  updateChannel,
  removeChannel,
  fetchChannelNotifcationOptOut,
  createChannelNotificationOptOut,
  removeChannelNotificationOptOut,
  removeChannelActivity,
  createChannelV2,
  fetchChannelV2,
  updateChannelV2,
  removeChannelV2,
  fetchChannelNotifcationOptOutV2,
  createChannelNotificationOptOutV2,
  removeChannelNotificationOptOutV2,
  removeChannelActivityV2,
} from "./discussions/api/channels/channels";
export {
  discussionsApiRequest,
  discussionsApiRequestV2,
} from "./discussions/api/discussions-api-request";
export {
  searchPosts,
  exportPosts,
  createPost,
  createReply,
  fetchPost,
  removePost,
  updatePost,
  updatePostStatus,
  searchPostsV2,
  exportPostsV2,
  createPostV2,
  createReplyV2,
  fetchPostV2,
  removePostV2,
  updatePostV2,
  updatePostStatusV2,
} from "./discussions/api/posts/posts";
export {
  createReaction,
  removeReaction,
  createReactionV2,
  removeReactionV2,
} from "./discussions/api/reactions/reactions";
export { getDefaultEntitySettings } from "./discussions/api/settings/getDefaultEntitySettings";
export {
  createSetting,
  fetchSetting,
  updateSetting,
  removeSetting,
  createSettingV2,
  fetchSettingV2,
  updateSettingV2,
  removeSettingV2,
} from "./discussions/api/settings/settings";
export {
  SortOrder,
  PostReaction,
  SharingAccess,
  PostStatus,
  DiscussionType,
  DiscussionSource,
  PostRelation,
  ReactionRelation,
  ChannelFilter,
  CommonSort,
  SearchPostsFormat,
  Role,
  PostSort,
  PostType,
  ChannelSort,
  ChannelRelation,
  AclCategory,
  AclSubCategory,
  EntitySettingType,
} from "./discussions/api/types";
export { canCreateChannel } from "./discussions/api/utils/channels/can-create-channel";
export { canCreateChannelV2 } from "./discussions/api/utils/channels/can-create-channel-v2";
export { canDeleteChannel } from "./discussions/api/utils/channels/can-delete-channel";
export { canDeleteChannelV2 } from "./discussions/api/utils/channels/can-delete-channel-v2";
export { canEditChannel } from "./discussions/api/utils/channels/can-edit-channel";
export { canEditChannelV2 } from "./discussions/api/utils/channels/can-edit-channel-v2";
export { canModifyChannel } from "./discussions/api/utils/channels/can-modify-channel";
export { canPostToChannel } from "./discussions/api/utils/channels/can-post-to-channel";
export {
  canReadChannel,
  canReadFromChannel,
} from "./discussions/api/utils/channels/can-read-channel";
export { canReadChannelV2 } from "./discussions/api/utils/channels/can-read-channel-v2";
export { deriveUserRoleV2 } from "./discussions/api/utils/channels/derive-user-role-v2";
export {
  reduceByGroupMembership,
  isUserInOrg,
  isOrgAdminInOrg,
  userHasPrivilege,
  userHasPrivileges,
} from "./discussions/api/utils/platform";
export { canCreatePost } from "./discussions/api/utils/posts/can-create-post";
export { canCreatePostV2 } from "./discussions/api/utils/posts/can-create-post-v2";
export { canCreateReply } from "./discussions/api/utils/posts/can-create-reply";
export { canCreateReplyV2 } from "./discussions/api/utils/posts/can-create-reply-v2";
export { canDeletePost } from "./discussions/api/utils/posts/can-delete-post";
export { canDeletePostV2 } from "./discussions/api/utils/posts/can-delete-post-v2";
export {
  canModifyPost,
  canEditPost,
} from "./discussions/api/utils/posts/can-edit-post";
export {
  canModifyPostStatus,
  canEditPostStatus,
} from "./discussions/api/utils/posts/can-edit-post-status";
export { canEditPostStatusV2 } from "./discussions/api/utils/posts/can-edit-post-status-v2";
export { canEditPostV2 } from "./discussions/api/utils/posts/can-edit-post-v2";
export { cannotCreatePostGroupsBlockedV2 } from "./discussions/api/utils/posts/cannot-create-post-groups-blocked-v2";
export { parseDiscussionURI } from "./discussions/api/utils/posts/parse-discussion-uri";
export { parseMentionedUsers } from "./discussions/api/utils/posts/parse-mentioned-users";
export { canCreateReaction } from "./discussions/api/utils/reactions/can-create-reaction";
export { canCreateReactionV2 } from "./discussions/api/utils/reactions/can-create-reaction-v2";
export { CANNOT_DISCUSS, MENTION_ATTRIBUTE } from "./discussions/constants";
export {
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
} from "./discussions/edit";
export { fetchDiscussion, convertItemToDiscussion } from "./discussions/fetch";
export { HubDiscussion } from "./discussions/HubDiscussion";
export {
  isDiscussable,
  setDiscussableKeyword,
  isPublicChannel,
  isOrgChannel,
  isPrivateChannel,
  getChannelAccess,
  getChannelOrgIds,
  getChannelGroupIds,
  getChannelUsersQuery,
  channelToSearchResult,
  getPostCSVFileName,
} from "./discussions/utils";
export {
  WGS84_WKID,
  serializeSpatialReference,
  buildExistingExportsPortalQuery,
  getSpatialRefTypeKeyword,
  getExportItemTypeKeyword,
  getExportLayerTypeKeyword,
} from "./downloads/build-existing-exports-portal-query";
export { canUseCreateReplica } from "./downloads/canUseCreateReplica";
export { canUseHubDownloadApi } from "./downloads/canUseHubDownloadApi";
export { canUseHubDownloadSystem } from "./downloads/canUseHubDownloadSystem";
export { fetchDownloadFile } from "./downloads/fetchDownloadFile";
export { getDownloadConfiguration } from "./downloads/getDownloadConfiguration";
export { getDownloadFormats } from "./downloads/getDownloadFormats";
export { getHubDownloadApiFormats } from "./downloads/getHubDownloadApiFormats";
export {
  PORTAL_EXPORT_TYPES,
  ServiceDownloadFormat,
  DownloadOperationStatus,
  ArcgisHubDownloadError,
  ArcgisHubDownloadFileTooLargeError,
} from "./downloads/types";
export {
  createHubEvent,
  updateHubEvent,
  deleteHubEvent,
  createHubEventRegistration,
  deleteHubEventRegistration,
} from "./events/edit";
export { fetchEvent, convertClientEventToHubEvent } from "./events/fetch";
export { getEventGroups } from "./events/getEventGroups";
export { HubEvent } from "./events/HubEvent";
export { HubEventAttendanceType, HubEventCapacityType } from "./events/types";
export {
  bBoxToExtent,
  createExtent,
  extentToBBox,
  GLOBAL_EXTENT,
  orgExtent,
  getOrgExtentAsBBox,
  isValidExtent,
  extentToPolygon,
  getExtentCenter,
  allCoordinatesPossiblyWGS84,
  GeoJSONPolygonToBBox,
} from "./extent";
export { _unprotectAndRemoveGroup } from "./groups/_unprotect-and-remove-group";
export { addUsersToGroup } from "./groups/add-users-workflow/add-users-to-group";
export { _consolidateResults } from "./groups/add-users-workflow/output-processors/_consolidate-results";
export { _formatAutoAddResponse } from "./groups/add-users-workflow/output-processors/_format-auto-add-response";
export { _processAutoAdd } from "./groups/add-users-workflow/output-processors/_process-auto-add";
export { _processInvite } from "./groups/add-users-workflow/output-processors/_process-invite";
export { _processPrimaryEmail } from "./groups/add-users-workflow/output-processors/_process-primary-email";
export { _processSecondaryEmail } from "./groups/add-users-workflow/output-processors/_process-secondary-email";
export { _canEmailUser } from "./groups/add-users-workflow/utils/_can-email-user";
export { _getAutoAddUsers } from "./groups/add-users-workflow/utils/_get-auto-add-users";
export { _getEmailUsers } from "./groups/add-users-workflow/utils/_get-email-users";
export { _getInviteUsers } from "./groups/add-users-workflow/utils/_get-invite-users";
export { _isOrgAdmin } from "./groups/add-users-workflow/utils/_is-org-admin";
export { addGroupMembers } from "./groups/addGroupMembers";
// TODO: The below are being used in hub-teams. When we deprecate that package we can move
// The below into _internal and remove the exports from here. They were previously in
// the add-users-workflow directory
export { autoAddUsers } from "./groups/autoAddUsers";
export { inviteUsers } from "./groups/inviteUsers";
export { emailOrgUsers } from "./groups/emailOrgUsers";
export { enrichGroupSearchResult } from "./groups/enrichGroupSearchResult";
// TODO: end
export { getWellKnownGroup } from "./groups/getWellKnownGroup";
export { HubGroup } from "./groups/HubGroup";
export {
  createHubGroup,
  fetchHubGroup,
  updateHubGroup,
  deleteHubGroup,
} from "./groups/HubGroups";
export { isOpenDataGroup } from "./groups/isOpenDataGroup";
export {
  HubFamilies,
  FileExtension,
  ItemType,
  addCreateItemTypes,
  HubEntityStatus,
  HubEntityHero,
} from "./hub-types";
export { convertToWellKnownLocale } from "./i18n/convert-to-well-known-locale";
export { fetchHubTranslation } from "./i18n/fetch-hub-translation";
export { getCulture } from "./i18n/get-culture";
export { HUB_LOCALES } from "./i18n/hub-locales";
export {
  createInitiativeTemplate,
  updateInitiativeTemplate,
  deleteInitiativeTemplate,
} from "./initiative-templates/edit";
export {
  fetchInitiativeTemplate,
  convertItemToInitiativeTemplate,
  enrichInitiativeTemplateSearchResult,
} from "./initiative-templates/fetch";
export { HubInitiativeTemplate } from "./initiative-templates/HubInitiativeTemplate";
export {
  initiativeTemplateToCardModel,
  initiativeTemplateResultToCardModel,
} from "./initiative-templates/view";
export { HubInitiative } from "./initiatives/HubInitiative";
export {
  createInitiative,
  updateInitiative,
  fetchInitiative,
  deleteInitiative,
  convertItemToInitiative,
  enrichInitiativeSearchResult,
  getPendingProjectsQuery,
} from "./initiatives/HubInitiatives";
export {
  initiativeToCardModel,
  initiativeResultToCardModel,
} from "./initiatives/view";
export { _unprotectAndRemoveItem } from "./items/_unprotect-and-remove-item";
export { applyPropertiesToItems } from "./items/apply-properties-to-items";
export { createItemFromFile } from "./items/create-item-from-file";
export { createItemFromUrl } from "./items/create-item-from-url";
export { createItemFromUrlOrFile } from "./items/create-item-from-url-or-file";
export { deleteProp } from "./items/delete-prop";
export { deleteItemThumbnail } from "./items/deleteItemThumbnail";
export { doesItemExistWithTitle } from "./items/does-item-exist-with-title";
export { failSafeUpdate } from "./items/fail-safe-update";
export { fetchItem } from "./items/fetch";
export { fetchAllPages } from "./items/fetch-all-pages";
export {
  getEntityFollowersGroupId,
  isUserFollowing,
  followEntity,
  unfollowEntity,
} from "./items/follow";
export { getModelFromOptions } from "./items/get-model-from-options";
export {
  STANDARD_LICENSES,
  getStructuredLicense,
} from "./items/get-structured-license";
export { getUniqueItemTitle } from "./items/get-unique-item-title";
export { getItemIdentifier } from "./items/getItemIdentifier";
export { interpolate } from "./items/interpolate";
export { interpolateItemId } from "./items/interpolate-item-id";
export { isServicesDirectoryDisabled } from "./items/is-services-directory-disabled";
export {
  itemPropsNotInTemplates,
  normalizeSolutionTemplateItem,
} from "./items/normalize-solution-template-item";
export { registerBrowserApp } from "./items/registerBrowserApp";
export { replaceItemId } from "./items/replace-item-id";
export { setItemThumbnail } from "./items/setItemThumbnail";
export { shareItemToGroups } from "./items/share-item-to-groups";
export {
  constructSlug,
  setSlugKeyword,
  getItemBySlug,
  findItemsBySlug,
  getUniqueSlug,
} from "./items/slugs";
export { unprotectModel } from "./items/unprotect-model";
export { unshareItemFromGroups } from "./items/unshare-item-from-groups";
export { uploadImageResource } from "./items/uploadImageResource";
export { aggregateMetrics } from "./metrics/aggregateMetrics";
export { editorToMetric, buildWhereClause } from "./metrics/editorToMetric";
export { getEntityMetrics } from "./metrics/getEntityMetrics";
export { resolveMetric } from "./metrics/resolveMetric";
export { createModel } from "./models/createModel";
export { fetchModelFromItem } from "./models/fetchModelFromItem";
export { fetchModelResources } from "./models/fetchModelResource";
export { getModel } from "./models/getModel";
export { getModelBySlug } from "./models/getModelBySlug";
export { serializeModel } from "./models/serializeModel";
export { updateModel } from "./models/updateModel";
export { upsertModelResources } from "./models/upsertModelResource";
export { notify } from "./newsletters-scheduler/api/subscriptions";
export {
  SchedulerDeliveryMethod,
  SchedulerSystemNotificationSpecNames,
  SubscriptionEntityType,
  SchedulerCadence,
  SchedulerSubscriptionAction,
} from "./newsletters-scheduler/api/types";
export {
  subscribe,
  createSubscription,
  getSubscriptions,
  getSubscription,
  updateSubscription,
} from "./newsletters/api/subscriptions";
export {
  NewsletterCadence,
  DeliveryMethod,
  SystemNotificationSpecNames,
  SubscriptionAction,
} from "./newsletters/api/types";
export { createUser, deleteUser } from "./newsletters/api/users";
export {
  _deepMapValues,
  _isString,
  _isDate,
  _isFunction,
  _isObject,
  _isRegExp,
} from "./objects/_deep-map-values";
export { _mapValues } from "./objects/_map-values";
export { deepSet } from "./objects/deep-set";
export { deepStringReplace } from "./objects/deep-string-replace";
export { deepDeletePropByValue } from "./objects/deepDeletePropByValue";
export { deepFilter } from "./objects/deepFilter";
export { deepFindById, deepFind } from "./objects/deepFind";
export { ensureProp } from "./objects/ensure-prop";
export { getProp } from "./objects/get-prop";
export { getProps } from "./objects/get-props";
export { getWithDefault } from "./objects/get-with-default";
export { mergeObjects } from "./objects/merge-objects";
export { pickProps } from "./objects/pickProps";
export { removeEmptyProps } from "./objects/remove-empty-props";
export { resolveReferences } from "./objects/resolveReferences";
export { setProp } from "./objects/set-prop";
export {
  fetchOrganization,
  portalToSearchResult,
  portalToOrganization,
} from "./org/fetch";
export { fetchOrg } from "./org/fetch-org";
export {
  fetchOrgLimits,
  fetchMaxNumUserGroupsLimit,
} from "./org/fetchOrgLimits";
export { HubPage } from "./pages/HubPage";
export {
  createPage,
  updatePage,
  fetchPage,
  convertModelToPage,
  convertItemToPage,
  deletePage,
  enrichPageSearchResult,
} from "./pages/HubPages";
export { checkPermission } from "./permissions/checkPermission";
export {
  HubPermissionsPolicies,
  getPermissionPolicy,
} from "./permissions/HubPermissionPolicies";
export { isPermission } from "./permissions/isPermission";
export { COLLABORATION_TYPES } from "./permissions/types/IEntityPermissionPolicy";
export {
  addPermissionPolicy,
  removePermissionPolicy,
} from "./permissions/utils";
export { createProject, updateProject, deleteProject } from "./projects/edit";
export {
  fetchProject,
  convertItemToProject,
  enrichProjectSearchResult,
} from "./projects/fetch";
export { HubProject } from "./projects/HubProject";
export { projectToCardModel, projectResultToCardModel } from "./projects/view";
export { RemoteServerError, hubApiRequest } from "./request";
export { _addTokenToResourceUrl } from "./resources/_add-token-to-resource-url";
export { addSolutionResourceUrlToAssets } from "./resources/add-solution-resource-url-to-assets";
export { convertSolutionTemplateResourcesToAssets } from "./resources/convert-solution-template-resources-to-assets";
export { doesResourceExist } from "./resources/doesResourceExist";
export { fetchAndUploadResource } from "./resources/fetch-and-upload-resource";
export { fetchAndUploadThumbnail } from "./resources/fetch-and-upload-thumbnail";
export { fetchImageAsBlob } from "./resources/fetch-image-as-blob";
export { getItemAssets } from "./resources/get-item-assets";
export { getItemThumbnailUrl } from "./resources/get-item-thumbnail-url";
export { getOrgThumbnailUrl } from "./resources/get-org-thumbnail-url";
export { isService } from "./resources/is-service";
export { objectToJsonBlob } from "./resources/object-to-json-blob";
export { removeResource } from "./resources/removeResource";
export { stringToBlob } from "./resources/string-to-blob";
export { uploadResourcesFromUrl } from "./resources/upload-resources-from-url";
export { upsertResource } from "./resources/upsertResource";
export { validateUrl } from "./resources/validate-url";
export { Catalog } from "./search/Catalog";
export { Collection } from "./search/Collection";
export { combineQueries } from "./search/combineQueries";
export { explainQueryResult } from "./search/explainQueryResult";
export { getCatalogGroups } from "./search/getCatalogGroups";
export { getPredicateValues } from "./search/getPredicateValues";
export { getUserGroupsByMembership } from "./search/getUserGroupsByMembership";
export { getUserGroupsFromQuery } from "./search/getUserGroupsFromQuery";
export { hubSearch } from "./search/hubSearch";
export { negateGroupPredicates } from "./search/negateGroupPredicates";
export { relativeDateToDateRange } from "./search/relativeDateToDateRange";
export { searchAssociatedContent } from "./search/searchAssociatedContent";
export { searchCatalogs } from "./search/searchCatalogs";
export { searchEntityCatalogs } from "./search/searchEntityCatalogs";
export { serializeCatalogScope } from "./search/serializeCatalogScopeQuery";
export { serializeQueryForPortal } from "./search/serializeQueryForPortal";
export { targetEntities } from "./search/types/IHubCatalog";
export { CATALOG_SETUP_TYPES } from "./search/types/types";
export {
  CATALOG_SCHEMA_VERSION,
  upgradeCatalogSchema,
} from "./search/upgradeCatalogSchema";
export {
  getGroupThumbnailUrl,
  getUserThumbnailUrl,
  migrateToCollectionKey,
  getScopeGroupPredicate,
  getGroupPredicate,
  getResultSiteRelativeLink,
  addDefaultItemSearchPredicates,
  getKilobyteSizeOfQuery,
  expandPortalQuery,
} from "./search/utils";
export { valueToMatchOptions } from "./search/valueToMatchOptions";
export {
  WELL_KNOWN_ITEM_CATALOGS,
  WELL_KNOWN_GROUP_CATALOGS,
  WELL_KNOWN_EVENT_CATALOGS,
  dotifyString,
  getWellKnownCatalogs,
  getWellKnownCatalog,
  getWellknownCollections,
  getWellknownCollection,
} from "./search/wellKnownCatalog";
export { _ensureTelemetry } from "./sites/_internal/_ensure-telemetry";
export { _migrateEventListCardConfigs } from "./sites/_internal/_migrate-event-list-card-configs";
export { _migrateFeedConfig } from "./sites/_internal/_migrate-feed-config";
export { _migrateLinkUnderlinesCapability } from "./sites/_internal/_migrate-link-underlines-capability";
export { _migrateTelemetryConfig } from "./sites/_internal/_migrate-telemetry-config";
export { _migrateToV2Catalog } from "./sites/_internal/_migrate-to-v2-catalog";
export { migrateBadBasemap } from "./sites/_internal/migrateBadBasemap";
export { migrateWebMappingApplicationSites } from "./sites/_internal/migrateWebMappingApplicationSites";
// Exporting these keys to access in the catalog builder so
// we can apply translated labels to default site collections
export { defaultSiteCollectionKeys } from "./sites/defaultSiteCollectionKeys";
export { _checkStatusAndParseJson } from "./sites/domains/_check-status-and-parse-json";
export { _ensureSafeDomainLength } from "./sites/domains/_ensure-safe-domain-length";
export { _getAuthHeader } from "./sites/domains/_get-auth-header";
export { _getDomainServiceUrl } from "./sites/domains/_get-domain-service-url";
export { _lookupPortal } from "./sites/domains/_lookup-portal";
export { addDomain } from "./sites/domains/add-domain";
export { addSiteDomains } from "./sites/domains/addSiteDomains";
export { domainExists } from "./sites/domains/domain-exists";
export { domainExistsPortal } from "./sites/domains/domain-exists-portal";
export { ensureUniqueDomainName } from "./sites/domains/ensure-unique-domain-name";
export { getDomainsForSite } from "./sites/domains/get-domains-for-site";
export { getUniqueDomainName } from "./sites/domains/get-unique-domain-name";
export { getUniqueDomainNamePortal } from "./sites/domains/get-unique-domain-name-portal";
export { isDomainForLegacySite } from "./sites/domains/is-domain-for-legacy-site";
export { isDomainUsedElsewhere } from "./sites/domains/is-domain-used-elsewhere";
export { isValidDomain } from "./sites/domains/is-valid-domain";
export { lookupDomain } from "./sites/domains/lookup-domain";
export { removeDomain } from "./sites/domains/remove-domain";
export { removeDomainsBySiteId } from "./sites/domains/remove-domains-by-site-id";
export { removeDomainByHostname } from "./sites/domains/removeDomainByHostname";
export { updateDomain } from "./sites/domains/update-domain";
export { buildDraft } from "./sites/drafts/build-draft";
export {
  getFeedConfiguration,
  setFeedConfiguration,
} from "./sites/feed-configuration";
export { getFeedTemplate } from "./sites/feeds/getFeedTemplate";
export { previewFeed } from "./sites/feeds/previewFeed";
export { setFeedTemplate } from "./sites/feeds/setFeedTemplate";
export { fetchSiteModel } from "./sites/fetchSiteModel";
export { getCatalogFromSiteModel } from "./sites/get-catalog-from-site-model";
export { getSiteById } from "./sites/get-site-by-id";
export { HubSite } from "./sites/HubSite";
export {
  HUB_SITE_ITEM_TYPE,
  ENTERPRISE_SITE_ITEM_TYPE,
  createSite,
  updateSite,
  deleteSite,
  fetchSite,
  convertModelToSite,
  convertItemToSite,
  enrichSiteSearchResult,
} from "./sites/HubSites";
export { reharvestSiteCatalog } from "./sites/reharvestSiteCatalog";
// Exporting temporarily since the content library needs this until it's deleted
export { searchCategoriesToCollections } from "./sites/searchCategoriesToCollections";
export { SITE_SCHEMA_VERSION } from "./sites/site-schema-version";
export { DEFAULT_THEME, getOrgDefaultTheme } from "./sites/themes";
export { upgradeSiteSchema } from "./sites/upgrade-site-schema";
export { getInputFeatureServiceModel } from "./surveys/utils/get-input-feature-service-model";
export { getS123EditUrl } from "./surveys/utils/get-s123-edit-url";
export { getS123ShareUrl } from "./surveys/utils/get-s123-share-url";
export { getSourceFeatureServiceModelFromFieldworker } from "./surveys/utils/get-source-feature-service-model-from-fieldworker";
export { getStakeholderModel } from "./surveys/utils/get-stakeholder-model";
export { getSurveyModels } from "./surveys/utils/get-survey-models";
export { isDraft } from "./surveys/utils/is-draft";
export { isFieldworkerView } from "./surveys/utils/is-fieldworker-view";
export {
  createTemplate,
  updateTemplate,
  editorToTemplate,
  deleteTemplate,
} from "./templates/edit";
export {
  fetchTemplate,
  convertItemToTemplate,
  enrichTemplateSearchResult,
} from "./templates/fetch";
export { HubTemplate } from "./templates/HubTemplate";
export {
  templateToCardModel,
  templateResultToCardModel,
} from "./templates/view";
export { _getHttpAndHttpsUris } from "./urls/_get-http-and-https-uris";
export { _getLocation } from "./urls/_get-location";
export { buildUrl } from "./urls/build-url";
export { cacheBustUrl } from "./urls/cacheBustUrl";
export { convertUrlsToAnchorTags } from "./urls/convert-urls-to-anchor-tags";
export {
  isMapOrFeatureServerUrl,
  getServiceTypeFromUrl,
} from "./urls/feature-service-urls";
export { getCampaignUrl } from "./urls/get-campaign-url";
export { getCdnAssetUrl } from "./urls/get-cdn-asset-url";
export { getHubApiUrlFromPortal } from "./urls/get-hub-api-url-from-portal";
export { getHubLocaleAssetUrl } from "./urls/get-hub-locale-asset-url";
export { getHubUrlFromPortal } from "./urls/get-hub-url-from-portal";
export { getItemApiUrl } from "./urls/get-item-api-url";
export { getItemDataUrl } from "./urls/get-item-data-url";
export { getItemHomeUrl } from "./urls/get-item-home-url";
export { getPortalApiUrl } from "./urls/get-portal-api-url";
export {
  getCardModelUrlFromResult,
  getCardModelUrlFromEntity,
} from "./urls/getCardModelUrl";
export { getContentHomeUrl } from "./urls/getContentHomeUrl";
export { getGroupHomeUrl } from "./urls/getGroupHomeUrl";
export { getHubApiFromPortalUrl } from "./urls/getHubApiFromPortalUrl";
export { getPortalBaseFromOrgUrl } from "./urls/getPortalBaseFromOrgUrl";
export { getUserHomeUrl } from "./urls/getUserHomeUrl";
export { HUB_CDN_URLMAP } from "./urls/hub-cdn-urlmap";
export { isSafeRedirectUrl } from "./urls/is-safe-redirect-url";
export { isEnterprisePortalUrl } from "./urls/isEnterprisePortalUrl";
export { stripProtocol } from "./urls/strip-protocol";
export { upgradeProtocol } from "./urls/upgrade-protocol";
export {
  convertUserToHubUser,
  enrichUserSearchResult,
  fetchHubUser,
} from "./users/HubUsers";
export { userResultToCardModel } from "./users/view";
export {
  cloneObject,
  arrayToObject,
  objectToArray,
  findBy,
  without,
  compose,
  createId,
  maybeAdd,
  maybePush,
  camelize,
  unique,
  uniqueBy,
  last,
  filterBy,
  extend,
  addDays,
  chunkArray,
  isNil,
  capitalize,
  flattenArray,
} from "./util";
export { isArrayEqual } from "./utils/array";
export { asyncForEach } from "./utils/asyncForEach";
export { batch } from "./utils/batch";
export { createOperationPipeline } from "./utils/create-operation-pipeline";
export { dasherize } from "./utils/dasherize";
export { getDatePickerDate } from "./utils/date/getDatePickerDate";
export { getTimePickerTime } from "./utils/date/getTimePickerTime";
export { guessTimeZone } from "./utils/date/guessTimeZone";
export { unicodeToBase64, base64ToUnicode } from "./utils/encoding";
export { ensureUniqueString } from "./utils/ensure-unique-string";
export { failSafe } from "./utils/fail-safe";
export { generateRandomString } from "./utils/generate-random-string";
export { getHubProduct } from "./utils/get-hub-product";
export { getSubscriptionType } from "./utils/get-subscription-type";
export { getEnvironmentFromPortalUrl } from "./utils/getEnvironmentFromPortalUrl";
export { getEventThumbnail } from "./utils/getEventThumbnail";
export { getObjectSize } from "./utils/getObjectSize";
export {
  updateUserSiteSettings,
  fetchUserSiteSettings,
  updateUserHubSettings,
  fetchUserHubSettings,
} from "./utils/hubUserAppResources";
export { includes } from "./utils/includes";
export { incrementString } from "./utils/increment-string";
export { isCuid } from "./utils/is-cuid";
export { isGuid } from "./utils/is-guid";
export { isUpdateGroup } from "./utils/is-update-group";
export { isComboboxItemSelected } from "./utils/isComboboxItemSelected";
export { Logger } from "./utils/logger";
export { mapBy } from "./utils/map-by";
export { memoize, clearMemoizedCache } from "./utils/memoize";
export { poll } from "./utils/poll";
export { propifyString } from "./utils/propify-string";
export {
  runRevertableTask,
  processRevertableTasks,
} from "./utils/revertable-tasks";
export { slugify } from "./utils/slugify";
export { titleize } from "./utils/titleize";
export { wait } from "./utils/wait";
export { withoutByProp } from "./utils/without-by-prop";
export { createVersion } from "./versioning/createVersion";
export { deleteVersion } from "./versioning/deleteVersion";
export { getVersion } from "./versioning/getVersion";
export { searchVersions } from "./versioning/searchVersions";
export { updateVersion } from "./versioning/updateVersion";
export { updateVersionMetadata } from "./versioning/updateVersionMetadata";
export { applyVersion, checkForStaleVersion } from "./versioning/utils";
export {
  ICreateEventMetadata,
  ICreateTelemetryReportMetadata,
  INotificationSpec,
  ISubscribeMetadata,
  ISubscription,
  ISubscriptionMetadata,
  IUser,
} from "./newsletters/api/types";
export {
  ISchedulerSubscriptionMetadata,
  ISubscriptionCatalog,
  ISchedulerUser,
  ISchedulerNotificationSpec,
  ISchedulerSubscription,
  INotify,
} from "./newsletters-scheduler/api/types";

// Re-exports
export { OperationStack, OperationError, HubError };
export { btoa, atob } from "abab";
