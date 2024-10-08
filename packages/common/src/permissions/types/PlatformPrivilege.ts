/**
 * Type that defines Platform Privileges
 * TODO: Ensure this is a complete list
 */

export type PlatformPrivilege =
  | "features:user:edit"
  | "features:user:fullEdit"
  | "features:user:manageVersions"
  | "marketplace:admin:manage"
  | "marketplace:admin:purchase"
  | "marketplace:admin:startTrial"
  | "opendata:user:designateGroup"
  | "opendata:user:openDataAdmin"
  | "portal:admin:assignToGroups"
  | "portal:admin:categorizeItems"
  | "portal:admin:changeUserRoles"
  | "portal:admin:createGPWebhook"
  | "portal:admin:createUpdateCapableGroup"
  | "portal:admin:createLeavingDisallowedGroup"
  | "portal:admin:deleteGroups"
  | "portal:admin:deleteItems"
  | "portal:admin:deleteUsers"
  | "portal:admin:disableUsers"
  | "portal:admin:inviteUsers"
  | "portal:admin:manageCollaborations"
  | "portal:admin:manageCredits"
  | "portal:admin:manageEnterpriseGroups"
  | "portal:admin:manageLicenses"
  | "portal:admin:manageRoles"
  | "portal:admin:manageSecurity"
  | "portal:admin:manageServers"
  | "portal:admin:manageUtilityServices"
  | "portal:admin:manageWebhooks"
  | "portal:admin:manageWebsite"
  | "portal:admin:reassignGroups"
  | "portal:admin:reassignItems"
  | "portal:admin:reassignUsers"
  | "portal:admin:shareToGroup"
  | "portal:admin:shareToOrg"
  | "portal:admin:shareToPublic"
  | "portal:admin:updateGroups"
  | "portal:admin:updateItemCategorySchema"
  | "portal:admin:updateItems"
  | "portal:admin:updateMemberCategorySchema"
  | "portal:admin:updateUsers"
  | "portal:admin:viewGroups"
  | "portal:admin:viewItems"
  | "portal:admin:viewUsers"
  | "portal:publisher:bulkPublishFromDataStores"
  | "portal:publisher:createDataPipelines"
  | "portal:publisher:createFeatureWebhook"
  | "portal:publisher:publishBigDataAnalytics"
  | "portal:publisher:publishDynamicImagery"
  | "portal:publisher:publishFeatures"
  | "portal:publisher:publishFeeds"
  | "portal:publisher:publishKnowledgeGraph"
  | "portal:publisher:publishRealTimeAnalytics"
  | "portal:publisher:publishScenes"
  | "portal:publisher:publishServerGPServices"
  | "portal:publisher:publishServerServices"
  | "portal:publisher:publishTiledImagery"
  | "portal:publisher:publishTiles"
  | "portal:publisher:registerDataStores"
  | "portal:user:addExternalMembersToGroup"
  | "portal:user:categorizeItems"
  | "portal:user:createGroup"
  | "portal:user:createItem"
  | "portal:user:invitePartneredCollaborationMembers"
  | "portal:user:joinGroup"
  | "portal:user:joinNonOrgGroup"
  | "portal:user:reassignItems"
  | "portal:user:receiveItems"
  | "portal:user:runWebTool"
  | "portal:user:shareGroupToOrg"
  | "portal:user:shareGroupToPublic"
  | "portal:user:shareToGroup"
  | "portal:user:shareToOrg"
  | "portal:user:shareToPublic"
  | "portal:user:viewHostedFeatureServices"
  | "portal:user:viewHostedTileServices"
  | "portal:user:viewOrgGroups"
  | "portal:user:viewOrgItems"
  | "portal:user:viewOrgUsers"
  | "portal:user:viewTracks"
  | "premium:publisher:createAdvancedNotebooks"
  | "premium:publisher:createNotebooks"
  | "premium:publisher:geoanalytics"
  | "premium:publisher:rasteranalysis"
  | "premium:publisher:scheduleNotebooks"
  | "premium:user:demographics"
  | "premium:user:elevation"
  | "premium:user:featurereport"
  | "premium:user:geocode:stored"
  | "premium:user:geocode:temporary"
  | "premium:user:geocode"
  | "premium:user:geoenrichment"
  | "premium:user:networkanalysis:closestfacility"
  | "premium:user:networkanalysis:locationallocation"
  | "premium:user:networkanalysis:optimizedrouting"
  | "premium:user:networkanalysis:origindestinationcostmatrix"
  | "premium:user:networkanalysis:routing"
  | "premium:user:networkanalysis:servicearea"
  | "premium:user:networkanalysis:vehiclerouting"
  | "premium:user:networkanalysis"
  | "premium:user:places"
  | "premium:user:spatialanalysis";
