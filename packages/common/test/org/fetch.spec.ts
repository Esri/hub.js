import { describe, it, expect, afterEach, vi } from "vitest";
import { IPortal } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { fetchOrganization, portalToSearchResult } from "../../src/org/fetch";
import { cloneObject } from "../../src/util";
import * as fetchOrgModule from "../../src/org/fetch-org";

describe("HubOrganizations", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe("convert to searchResult", () => {
    it("converts", () => {
      const result = portalToSearchResult(PORTAL);
      expect(result).toEqual({
        id: "Xj56SBi2udA78cC9",
        title: "QA Premium Alpha Hub",
        name: "QA Premium Alpha Hub",
        url: "https://qa-pre-a-hub.mapsqa.arcgis.com",
        type: "Organization",
        family: "organization",
        source: "portal",
        createdDate: new Date(PORTAL.created),
        createdDateSource: "portal",
        updatedDate: new Date(PORTAL.modified),
        updatedDateSource: "portal",
        thumbnailUrl:
          "https://qa-pre-a-hub.mapsqa.arcgis.com/sharing/rest/portals/Xj56SBi2udA78cC9/resources/thumbnail1707251441205.png",
        thumbnail: "thumbnail1707251441205.png",
        description: "<br>",
        access: "public",
        tags: [],
        typeKeywords: [],
        links: {
          self: "https://qa-pre-a-hub.mapsqa.arcgis.com",
          thumbnail:
            "https://qa-pre-a-hub.mapsqa.arcgis.com/sharing/rest/portals/Xj56SBi2udA78cC9/resources/thumbnail1707251441205.png",
        },
      });
    });
  });
  describe("fetchOrganization", () => {
    it("fetches an organization from the portal", async () => {
      const ro = {
        authentication: {
          token: "FAKETOKEN",
        },
      } as unknown as IRequestOptions;
      const spy = vi
        .spyOn(fetchOrgModule, "fetchOrg")
        .mockReturnValue(Promise.resolve(cloneObject(PORTAL)));
      const org = await fetchOrganization("123", ro);
      expect(org.portal).toEqual(PORTAL);
      expect(spy).toHaveBeenCalledWith("123", ro);
      expect(org.id).toBe(PORTAL.id);
      expect(org.orgId).toBe(PORTAL.id);
      expect(org.access).toBe(PORTAL.access);
      expect(org.name).toBe(PORTAL.name);
      expect(org.summary).toBe(PORTAL.description);
      expect(org.description).toBe(PORTAL.description);
      expect(org.type).toBe("Organization");
      expect(org.source).toBe("portal");
      expect(org.createdDate).toEqual(new Date(PORTAL.created));
      expect(org.createdDateSource).toBe("portal");
      expect(org.updatedDate).toEqual(new Date(PORTAL.modified));
      expect(org.updatedDateSource).toBe("portal");
      expect(org.thumbnail).toBe(PORTAL.thumbnail);
      expect(org.url).toBe(
        `https://${PORTAL.urlKey as string}.${PORTAL.customBaseUrl as string}`
      );
      expect(org.thumbnailUrl).toBe(
        "https://qa-pre-a-hub.mapsqa.arcgis.com/sharing/rest/portals/Xj56SBi2udA78cC9/resources/thumbnail1707251441205.png"
      );
    });

    it("org url handled for enterprise", async () => {
      const ro = {
        authentication: {
          token: "FAKETOKEN",
        },
      } as unknown as IRequestOptions;

      const portal = cloneObject(PORTAL);
      delete portal.urlKey;

      vi.spyOn(fetchOrgModule, "fetchOrg").mockReturnValue(
        Promise.resolve(portal)
      );
      const org = await fetchOrganization("123", ro);
      expect(org.url).toBe(`https://${PORTAL.portalHostname as string}`);
    });
  });
});

const PORTAL: IPortal = {
  "2DSketchStylesGroupQuery": 'title:"Esri Sketch Styles" AND owner:esri_en',
  "2DStylesGroupQuery": 'title:"Esri 2D Styles" AND owner:esri_en',
  "3DBasemapGalleryGroupQuery":
    'title:"ArcGIS Online 3D Basemaps" AND owner:esri_en',
  access: "public",
  aiAssistantsEnabled: false,
  allSSL: true,
  allowedRedirectUris: [],
  analysisLayersGroupQuery:
    'title:"Living Atlas Analysis Layers" AND owner:esri',
  authorizedCrossOriginDomains: [],
  availableCredits: 894432.5,
  basemapGalleryGroupQuery: "id:51fe416438674bb2a2fb7824b5d4df63",
  canListApps: false,
  canListConsultingServices: false,
  canListData: false,
  canListPreProvisionedItems: false,
  canListSolutions: false,
  canProvisionDirectPurchase: false,
  canSearchPublic: true,
  canSetCustomBuyLink: false,
  canSetQuestionnaire: false,
  canShareBingPublic: false,
  canSharePublic: true,
  canSignInArcGIS: true,
  canSignInIDP: true,
  canSignInOIDC: true,
  canSignInSocial: true,
  cdnUrl: "https://cdnqa.arcgis.com",
  colocateCompute: false,
  colorSetsGroupQuery: 'title:"Esri Colors" AND owner:esri_en',
  commentsEnabled: true,
  contentCategorySetsGroupQuery:
    'title:"ArcGIS Online Content Category Sets" AND owner:esri_en',
  created: 1557506685000,
  culture: "en-US",
  cultureFormat: "us",
  customBaseUrl: "mapsqa.arcgis.com",
  databaseQuota: -1,
  databaseUsage: -1,
  default3DBasemapQuery:
    'typekeywords:"sourceId#topographic" AND type:"Web Scene" AND owner:esri_en',
  defaultBasemap: {
    id: "a17e26cc129844668c8af39e26144006",
    title: "Colored Pencil Map",
    baseMapLayers: [
      {
        id: "VectorTile_4246",
        type: "VectorTileLayer",
        layerType: "VectorTileLayer",
        title: "Colored Pencil",
        styleUrl:
          "https://cdn.arcgis.com/sharing/rest/content/items/aa30dd52509a4fea939ccbfc3c3e14de/resources/styles/root.json",
        visibility: true,
        opacity: 1,
      },
    ],
    operationalLayers: [],
  },
  defaultDevBasemap: {
    baseMapLayers: [
      {
        id: "World_Hillshade_2559",
        layerType: "ArcGISTiledMapServiceLayer",
        url: "https://ibasemaps-api.arcgis.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer",
        visibility: true,
        opacity: 1,
        title: "World Hillshade",
      },
      {
        id: "VectorTile_9568",
        type: "VectorTileLayer",
        layerType: "VectorTileLayer",
        title: "World Topographic Map",
        styleUrl:
          "https://cdn.arcgis.com/sharing/rest/content/items/42df0d22517e49ad84edcee4c093857d/resources/styles/root.json",
        visibility: true,
        opacity: 1,
      },
    ],
    title: "Topographic",
  },
  defaultExtent: {
    xmin: -1.4999967425920729e7,
    ymin: 2352563.634308756,
    xmax: -6200050.359221956,
    ymax: 6499962.170403291,
    spatialReference: {
      wkid: 102100,
    },
  },
  defaultUserCreditAssignment: -1,
  defaultVectorBasemap: {
    baseMapLayers: [
      {
        id: "World_Hillshade_3805",
        layerType: "ArcGISTiledMapServiceLayer",
        url: "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer",
        visibility: true,
        opacity: 1,
        title: "World Hillshade",
      },
      {
        id: "VectorTile_2333",
        type: "VectorTileLayer",
        layerType: "VectorTileLayer",
        title: "World Topographic Map",
        styleUrl:
          "https://cdn.arcgis.com/sharing/rest/content/items/7dc6cea0b1764a1f9af2e679f642f0f5/resources/styles/root.json",
        visibility: true,
        opacity: 1,
      },
    ],
    title: "Topographic",
  },
  description: "<br>",
  dev3DBasemapGalleryGroupQuery:
    'title:"World 3D Basemaps for Developers" AND owner:esri_en',
  devBasemapGalleryGroupQuery:
    'title:"World Basemaps for Developers" AND owner:esri',
  eueiEnabled: true,
  featuredGroups: [
    {
      title: "Esri Maps and Data",
      owner: "esri",
    },
    {
      title: "Living Atlas Curator Favorites",
      owner: "dkensok",
    },
    {
      title: "Web Application Templates",
      owner: "esri_en",
    },
    {
      title: "ArcGIS for Local Government",
      owner: "ArcGISTeamLocalGov",
    },
  ],
  featuredGroupsId: "",
  featuredItemsGroupQuery: "",
  fontManifestUrl: "https://staticqa.arcgis.com/fonts/fontManifestUrl.json",
  galleryTemplatesGroupQuery: 'title:"Gallery Templates" AND owner:esri_en',
  hasCategorySchema: true,
  hasMemberCategorySchema: true,
  helpBase: "https://docuat.arcgis.com/en/arcgis-online/",
  helperServices: {
    aiAssistantServices: {
      url: "https://aiservicesqa-beta.arcgis.com",
      docChatAssistant: "/skills/doc_chat",
      sqlGenerationAssistant: "/skills/sqlGeneration",
      graphQueryAssistant: "/skills/graphQueryGeneration",
      questionAnswerAssistant: "/skills/question_answer",
      itemInformationAssistant: "/skills/item_information_suggester",
    },
    aiUtilityServices: {
      url: "https://aiutilsqa.arcgis.com",
      translatUtility: "/api/translate",
      imageExtractTextUtility: "/api/assistant/imageExtractText",
    },
    asyncClosestFacility: {
      url: "https://logisticsqa.arcgis.com/arcgis/rest/services/World/ClosestFacility/GPServer/FindClosestFacilities",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
    asyncFleetRouting: {
      url: "https://logisticsqa.arcgis.com/arcgis/rest/services/World/VehicleRoutingProblem/GPServer",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
    asyncLocationAllocation: {
      url: "https://logisticsqa.arcgis.com/arcgis/rest/services/World/LocationAllocation/GPServer",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
    asyncODCostMatrix: {
      url: "https://logisticsqa.arcgis.com/arcgis/rest/services/World/OriginDestinationCostMatrix/GPServer",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
    asyncPrintTask: {
      url: "https://printqa.arcgis.com/arcgis/rest/services/PrintingToolsAsync/GPServer/Export%20Web%20Map%20Task",
    },
    asyncRoute: {
      url: "https://logisticsqa.arcgis.com/arcgis/rest/services/World/Route/GPServer",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
    asyncServiceArea: {
      url: "https://logisticsqa.arcgis.com/arcgis/rest/services/World/ServiceAreas/GPServer/GenerateServiceAreas",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
    asyncVRP: {
      url: "https://logisticsqa.arcgis.com/arcgis/rest/services/World/VehicleRoutingProblem/GPServer/SolveVehicleRoutingProblem",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
    closestFacility: {
      url: "https://routeqa.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
    dashboardsUtility: {
      url: "https://dashboardsqa-api.arcgis.com",
    },
    defaultElevationLayers: [
      {
        url: "https://elevation3dqa.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
        id: "globalElevation",
        layerType: "ArcGISTiledElevationServiceLayer",
        units: "esriMeters",
      },
    ],
    elevation: {
      url: "https://elevationqa.arcgis.com/arcgis/rest/services/Tools/Elevation/GPServer",
    },
    elevationSync: {
      url: "https://elevationqa.arcgis.com/arcgis/rest/services/Tools/ElevationSync/GPServer",
    },
    geocode: [
      {
        url: "https://geocodeqa.arcgis.com/arcgis/rest/services/World/GeocodeServer",
        northLat: "Ymax",
        southLat: "Ymin",
        eastLon: "Xmax",
        westLon: "Xmin",
        name: "ArcGIS World Geocoding Service",
        batch: true,
        placefinding: true,
        suggest: true,
        esri: true,
        ordinal: 0,
      },
      {
        placeholder: "",
        placefinding: true,
        batch: true,
        zoomScale: 10000,
      },
    ],
    geometry: {
      url: "https://utilityqa.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer",
    },
    hydrology: {
      url: "https://hydroqa.arcgis.com/arcgis/rest/services/Tools/Hydrology/GPServer",
    },
    layoutInfoTask: {
      url: "https://printqa.arcgis.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Get%20Layout%20Templates%20Info%20Task",
    },
    odCostMatrix: {
      url: "https://routeqa.arcgis.com/arcgis/rest/services/World/OriginDestinationCostMatrix/NAServer/OriginDestinationCostMatrix_World",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
    orthomappingElevation: {
      url: "https://elevation3dqa.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
    },
    packaging: {
      url: "https://packagingqa.arcgis.com/arcgis/rest/services/OfflinePackaging/GPServer",
      maxMapAreaItemsLimit: 16,
      exportTilesMap: [
        {
          source: "https://services.arcgisonline.com",
          export: "https://tiledbasemaps.arcgis.com",
        },
        {
          source: "https://basemaps-api.arcgis.com",
          export: "https://basemaps.arcgis.com",
        },
        {
          source: "https://ibasemaps-api.arcgis.com",
          export: "https://tiledbasemaps.arcgis.com",
        },
      ],
    },
    printTask: {
      url: "https://utilityqa.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
    },
    route: {
      url: "https://routeqa.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
    routingUtilities: {
      url: "https://logisticsqa.arcgis.com/arcgis/rest/services/World/Utilities/GPServer",
    },
    serviceArea: {
      url: "https://routeqa.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
    snapToRoads: {
      url: "https://logisticsqa.arcgis.com/arcgis/rest/services/World/SnapToRoadsSync/GPServer",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
    symbols: {
      url: "https://utilityqa.arcgisonline.com/arcgis/rest/services/Utilities/Symbols/SymbolServer",
    },
    syncVRP: {
      url: "https://logisticsqa.arcgis.com/arcgis/rest/services/World/VehicleRoutingProblemSync/GPServer/EditVehicleRoutingProblem",
      defaultTravelMode: "FEgifRtFndKNcJMJ",
    },
    traffic: {
      url: "https://trafficqa.arcgis.com/arcgis/rest/services/World/Traffic/MapServer",
    },
    trafficData: {
      url: "https://trafficqa.arcgis.com/arcgis/rest/services/World/TrafficFeeds/GPServer",
    },
    workflowManager: {
      url: "https://workflowqa.arcgis.com",
    },
    analysis: {
      url: "https://analysisqa.arcgis.com/arcgis/rest/services/tasks/GPServer",
    },
    geoenrichment: {
      url: "https://geoenrichqa.arcgis.com/arcgis/rest/services/World/GeoenrichmentServer",
    },
    asyncGeocode: {
      url: "https://analysisqa.arcgis.com/arcgis/rest/services/tasks/GPServer",
    },
    creditEstimation: {
      url: "https://analysisqa.arcgis.com/arcgis/rest/services/Estimate/GPServer",
    },
    rasterAnalytics: {
      url: "https://rasteranalysisqa.arcgis.com/arcgis/rest/services/RasterAnalysisTools/GPServer",
    },
    rasterUtilities: {
      url: "https://rasteranalysisqa.arcgis.com/arcgis/rest/services/Utilities/RasterUtilities/GPServer",
    },
    datastoreManagement: {
      url: "https://datastoreManagementqa.arcgis.com",
    },
    dataPipelines: {
      url: "https://datapipelinesservicesqa.arcgis.com",
    },
    analysisModels: {
      url: "https://analysismodelsservicesqa.arcgis.com",
    },
  },
  homePageFeaturedContent: "",
  homePageFeaturedContentCount: 12,
  id: "Xj56SBi2udA78cC9",
  inactivityTimeout: 0,
  isPortal: false,
  isVerified: false,
  layerTemplatesGroupQuery: 'title:"Esri Layer Templates" AND owner:esri_en',
  livingAtlasGroupQuery: 'title:"LAW Search" AND owner:Esri_LivingAtlas',
  maxTokenExpirationMinutes: 20160,
  metadataEditable: true,
  metadataFormats: ["fgdc"],
  modified: 1730833105000,
  name: "QA Premium Alpha Hub",
  notificationsEnabled: true,
  platformSSO: true,
  portalHostname: "qaext.arcgis.com",
  portalMode: "multitenant",
  portalName: "ArcGIS Online",
  portalProperties: {
    links: {
      contactUs: {
        url: "mailto:jschneider@esri.com",
        visible: true,
      },
    },
    openData: {
      enabled: true,
      settings: {
        migrations: {
          siteToItems: true,
        },
        appVersion: "2.1",
        groupId: "59d966af6b374a7190cd5ac6ddaeedab",
        canHandleCrossOrgSignin: true,
      },
    },
    sharedTheme: {
      header: {
        background: "#004da8",
        text: "#55ff00",
      },
      body: {
        background: "#ffffff",
        text: "#242424",
        link: "#004da8",
      },
      button: {
        background: "#55ff00",
        text: "#004da8",
      },
      logo: {
        small:
          "https://qa-pre-a-hub.mapsqa.arcgis.com/sharing/rest/content/items/ae2026ab67c04ad9ad0d109ce2ff8a07/data",
      },
    },
    showSocialMediaLinks: true,
    hub: {
      enabled: true,
      settings: {
        orgType: "enterprise",
        communityOrg: {
          orgId: "uFEMdY4VMonzH8sG",
          portalHostname: "qa-pre-a-hub-c.mapsqa.arcgis.com",
        },
        informationalBanner: true,
        events: {
          serviceId: "c21d54f428e947b285925e25aeacf689",
          publicViewId: "65fac67823d643d4a169d1fcc3f563e2",
        },
      },
    },
    homePage: "modern",
    mapViewer: "modern",
    topNav: {},
    mapViewerSwitchDate: 1640103406761,
  },
  portalThumbnail: null,
  rasterFunctionTemplatesGroupQuery:
    'title:"Raster Function Templates" AND owner:esri_en',
  region: "US",
  rotatorPanels: [
    {
      id: "banner-2",
      innerHTML:
        '<img src="images/banner-2.jpg" style="border-radius:0 0 10px 10px; margin-top:0; width:960px;height:180px;" /><div style="position: absolute; bottom: 80px; left:80px; max-height:65px; width: 660px; margin:0;"><img src="//qa-pre-a-hub.mapsqa.arcgis.com/sharing/rest/portals/self/resources/thumbnail1707251441205.png?token=SECURITY_TOKEN" alt="QA Premium Alpha Hub test test test" class="esriFloatLeading esriTrailingMargin025" style="margin-bottom:0;max-height:100px;" /><span style="position:absolute;bottom:0;margin-bottom:0;line-height:normal; font-family:HelveticaNeue,Verdana; font-weight:600;font-size:32px;color:#369;">QA Premium Alpha Hub test test test</span></div>',
    },
  ],
  showHomePageDescription: false,
  staticImagesUrl: "https://static.arcgis.com/images",
  storageQuota: 2199023255552,
  storageUsage: 6307604608,
  stylesGroupQuery: 'title:"Esri Styles" AND owner:esri_en',
  supports3DTilesServices: true,
  supportsHostedServices: true,
  symbolSetsGroupQuery: 'title:"Esri Symbols" AND owner:esri_en',
  templatesGroupQuery: 'title:"Web Application Templates" AND owner:esri_en',
  thumbnail: "thumbnail1707251441205.png",
  units: "english",
  updateUserProfileDisabled: false,
  urlKey: "qa-pre-a-hub",
  use3dBasemaps: true,
  useDefault3dBasemap: false,
  useStandardizedQuery: true,
  useVectorBasemaps: false,
  vectorBasemapGalleryGroupQuery:
    'title:"United States Vector Basemaps" AND owner:Esri_cy_US',
  subscriptionInfo: {
    id: "8799302912",
    type: "In House",
    options: ["Collaborate"],
    state: "active",
    expDate: 1748761199000,
    userLicenseTypes: {
      creatorUT: 50,
      viewerUT: 0,
    },
    maxUsersPerLevel: {
      "1": 0,
      "2": 50,
    },
    maxUsers: 50,
    availableCredits: 894432.5,
    collaborationSettings: {
      level: "4",
      maxItemSizeInMB: 1024,
      maxReplicationPackageSizeInMB: 5120,
    },
    hubSettings: {
      enabled: true,
    },
    companionOrganizations: [
      {
        organizationUrl: "qa-pre-a-hub-c.mapsqa.arcgis.com",
        orgId: "uFEMdY4VMonzH8sG",
        orgName: "QA Premium Alpha Hub Community",
        type: "Community",
        canSignInArcGIS: true,
        canSignInIDP: true,
        canSignInSocial: true,
        canSignInOIDC: true,
      },
    ],
  },
  recycleBinSupported: true,
  recycleBinEnabled: true,
  ipCntryCode: "US",
  httpPort: 80,
  httpsPort: 443,
  supportsOAuth: true,
  isReadOnly: false,
  currentVersion: "2025.1",
  allowedOrigins: [],
  mfaAdmins: [],
  allowedExternalLinks: [
    "https://dangerdocs.com",
    "https://polar.dangerdocs.com",
    "https://bobcustomsitetestqa.testopendata.com",
    "https://brollywood.hikes.dev",
    "https://quack.cantilever.dev",
  ],
  mfaEnabled: false,
  contacts: ["qa_pre_a_hub_admin"],
  user: {
    username: "paige_pa",
    udn: null,
    id: "0326236361294abfa5fdcca705a081e6",
    fullName: "Paige Makerson",
    categories: [
      "/Categories/a top level member category/a second nested member category/a third level nested member category",
    ],
    emailStatus: "verified",
    emailStatusDate: 1736540718000,
    firstName: "Paige",
    lastName: "Makerson",
    preferredView: null,
    description: "",
    email: "jschneider@esri.com",
    userType: "arcgisonly",
    idpUsername: null,
    favGroupId: "9873262490934951b1eb73ff6e6a19dc",
    lastLogin: 1739990435000,
    mfaEnabled: false,
    mfaEnforcementExempt: false,
    storageUsage: 6307604608,
    storageQuota: 2199023255552,
    orgId: "Xj56SBi2udA78cC9",
    role: "org_admin",
    privileges: [
      "features:user:edit",
      "features:user:fullEdit",
      "features:user:manageVersions",
      "marketplace:admin:manage",
      "marketplace:admin:purchase",
      "marketplace:admin:startTrial",
      "opendata:user:designateGroup",
      "opendata:user:openDataAdmin",
      "portal:admin:assignToGroups",
      "portal:admin:categorizeItems",
      "portal:admin:changeUserRoles",
      "portal:admin:createGPWebhook",
      "portal:admin:createLeavingDisallowedGroup",
      "portal:admin:createReports",
      "portal:admin:createUpdateCapableGroup",
      "portal:admin:deleteGroups",
      "portal:admin:deleteItems",
      "portal:admin:deleteUsers",
      "portal:admin:disableUsers",
      "portal:admin:inviteUsers",
      "portal:admin:manageCollaborations",
      "portal:admin:manageCredits",
      "portal:admin:manageEnterpriseGroups",
      "portal:admin:manageLicenses",
      "portal:admin:manageLivingAtlasPackageImports",
      "portal:admin:managePublicUrlUpdate",
      "portal:admin:manageRoles",
      "portal:admin:manageSecurity",
      "portal:admin:manageServers",
      "portal:admin:manageUtilityServices",
      "portal:admin:manageWebhooks",
      "portal:admin:manageWebsite",
      "portal:admin:reassignGroups",
      "portal:admin:reassignItems",
      "portal:admin:reassignUsers",
      "portal:admin:shareToGroup",
      "portal:admin:shareToOrg",
      "portal:admin:shareToPublic",
      "portal:admin:updateGroups",
      "portal:admin:updateItemCategorySchema",
      "portal:admin:updateItemClassificationSchema",
      "portal:admin:updateItems",
      "portal:admin:updateMemberCategorySchema",
      "portal:admin:updateUsers",
      "portal:admin:viewGroups",
      "portal:admin:viewItems",
      "portal:admin:viewUsers",
      "portal:publisher:bulkPublishFromDataStores",
      "portal:publisher:createDataPipelines",
      "portal:publisher:createFeatureWebhook",
      "portal:publisher:publishBigDataAnalytics",
      "portal:publisher:publishDynamicImagery",
      "portal:publisher:publishFeatures",
      "portal:publisher:publishFeeds",
      "portal:publisher:publishKnowledgeGraph",
      "portal:publisher:publishLivestreamVideo",
      "portal:publisher:publishRealTimeAnalytics",
      "portal:publisher:publishScenes",
      "portal:publisher:publishServerGPServices",
      "portal:publisher:publishServerServices",
      "portal:publisher:publishTiledImagery",
      "portal:publisher:publishTiles",
      "portal:publisher:publishVideo",
      "portal:publisher:registerDataStores",
      "portal:user:addExternalMembersToGroup",
      "portal:user:assignPrivilegesToApps",
      "portal:user:categorizeItems",
      "portal:user:createGroup",
      "portal:user:createItem",
      "portal:user:generateApiTokens",
      "portal:user:invitePartneredCollaborationMembers",
      "portal:user:joinGroup",
      "portal:user:joinNonOrgGroup",
      "portal:user:reassignItems",
      "portal:user:receiveItems",
      "portal:user:runWebTool",
      "portal:user:shareGroupToOrg",
      "portal:user:shareGroupToPublic",
      "portal:user:shareToGroup",
      "portal:user:shareToOrg",
      "portal:user:shareToPublic",
      "portal:user:viewHostedFeatureServices",
      "portal:user:viewHostedTileServices",
      "portal:user:viewOrgGroups",
      "portal:user:viewOrgItems",
      "portal:user:viewOrgUsers",
      "portal:user:viewTracks",
      "premium:publisher:createAdvancedNotebooks",
      "premium:publisher:createNotebooks",
      "premium:publisher:geoanalytics",
      "premium:publisher:rasteranalysis",
      "premium:publisher:scheduleNotebooks",
      "premium:user:basemaps",
      "premium:user:boundaries",
      "premium:user:demographics",
      "premium:user:elevation",
      "premium:user:featurereport",
      "premium:user:geocode",
      "premium:user:geocode:stored",
      "premium:user:geocode:temporary",
      "premium:user:geoenrichment",
      "premium:user:geometry",
      "premium:user:networkanalysis",
      "premium:user:networkanalysis:closestfacility",
      "premium:user:networkanalysis:lastmiledelivery",
      "premium:user:networkanalysis:locationallocation",
      "premium:user:networkanalysis:optimizedrouting",
      "premium:user:networkanalysis:origindestinationcostmatrix",
      "premium:user:networkanalysis:routing",
      "premium:user:networkanalysis:servicearea",
      "premium:user:networkanalysis:vehiclerouting",
      "premium:user:places",
      "premium:user:realitymapping",
      "premium:user:spatialanalysis",
      "premium:user:staticMaps",
      "premium:user:staticbasemaptiles",
    ],
    level: "2",
    userLicenseTypeId: "creatorUT",
    disabled: false,
    tags: [
      "hubInitiativeId|94d56737ff7444c7a57ec4739a7123b2",
      "hubEventGroupId|Xj56SBi2udA78cC9|5879185f40d34151bb9ac7000c98dd7f",
      "hubInitiativeId|2a407b5de61c43f6bb5df9d14614d318",
    ],
    culture: null,
    cultureFormat: null,
    region: "US",
    units: "english",
    thumbnail: "hub-profile-1559759137487.png",
    access: "org",
    created: 1558412565000,
    modified: 1718059703000,
    provider: "arcgis",
  },
  appInfo: {
    appId: "hubforarcgis",
    itemId: "a85781becc494f49940e0a7cb7236de1",
    appOwner: "esri_apps",
    orgId: "i7gAfcdQl7MlSCjA",
    appTitle: "ArcGIS Hub",
    privileges: [
      "premium:user:basemaps",
      "premium:user:demographics",
      "premium:user:elevation",
      "premium:user:geocode",
      "premium:user:geocode:stored",
      "premium:user:geocode:temporary",
      "premium:user:geoenrichment",
      "premium:user:networkanalysis",
      "premium:user:networkanalysis:closestfacility",
      "premium:user:networkanalysis:lastmiledelivery",
      "premium:user:networkanalysis:locationallocation",
      "premium:user:networkanalysis:optimizedrouting",
      "premium:user:networkanalysis:origindestinationcostmatrix",
      "premium:user:networkanalysis:routing",
      "premium:user:networkanalysis:servicearea",
      "premium:user:networkanalysis:vehiclerouting",
      "premium:user:places",
    ],
  },
};
