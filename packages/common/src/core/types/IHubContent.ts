import { IItem, IGroup } from "@esri/arcgis-rest-portal";
import { ILayerDefinition } from "@esri/arcgis-rest-feature-layer";
import { AccessControl, HubFamily, IActionLink, Visibility } from "../../types";
import { IStructuredLicense } from "../../items/get-structured-license";
import { IHubItemEntity } from ".";
import { IHubContentEnrichments } from "./IHubContentEnrichments";
import { IHubAdditionalResource } from "./IHubAdditionalResource";

export enum PublisherSource {
  CitationContact = "metadata.resource.citation.contact",
  ResourceContact = "metadata.resource.contact",
  MetadataContact = "metadata.contact",
  ItemOwner = "item.owner",
  None = "none",
}

// TODO: at next breaking change, IHubContent should no longer extend IItem
/**
 * Data model for content
 */
export interface IHubContent
  extends Omit<IHubItemEntity, "schemaVersion">,
    IHubContentEnrichments,
    IItem {
  // NOTE: for content we keep and expose a reference to the underlying item
  // b/c some top-level properties like type and categories have been
  // overwritten in a way that prevent us from reconstructing the original value
  // also we hold on to any fetched enrichments (data, metadata, etc)
  // so that we can re-compose new content objects as the state changes over time
  /**
   * The underlying portal item referenced by this content
   */
  item: IItem;

  /**
   * Slug that can be used to lookup an entity
   * by something other than it's id
   */
  slug?: string;

  /**
   * The content's ID for use with the Hub API
   * For most content this will be the item's id
   * For layers this will be `<itemId>_<layerId>`
   * This will be undefined for private items and in enterprise
   * because only public online items are included in the Hub API
   */
  hubId?: string;

  /**
   * The preferred identifier to use for Hub URLs.
   * This will be either the slug, hubId, or item id.
   */
  identifier: string;

  /**
   * Content visibility and access control, including groups
   */
  permissions: {
    /** Visibility of the content */
    visibility: Visibility;
    /** Current user's control over the content */
    control?: AccessControl;
    /** The groups that have access to the item (as far as you know) */
    groups?: IGroup[]; // TODO: item.sharing.groups via content/users/:username/items/:id
  };

  // TODO: make this required at next breaking release
  /**
   * The the family of related types that this content belongs to.
   */
  family?: HubFamily;

  /** Parsed item categories (see parseItemCategories) */
  categories?: string[];

  /** Whether the content is downloadable in the Hub app */
  isDownloadable: boolean;

  /** The content's structured license info */
  structuredLicense?: IStructuredLicense;

  /**
   * Date the content was published (formal metadata),
   * defaults to the date the content was created
   */
  publishedDate: Date;

  /** Description of the source of the published date */
  publishedDateSource?: string;

  /** Frequency at which the content is updated */
  updateFrequency?: string;

  /**
   * Info to display about the content's publisher. Follows this fallback pattern:
   * 1) Formal Item Metadata > Resource > Citation > Contact
   * 2) Formal Item Metadata > Resource > Contact
   * 3) Formal Item Metadata > Contact
   * 4) Item’s Owner and Org Name
   * 5) Undefined (Item Owner / Org are private and we can't access additional info)
   */
  publisher?: {
    name?: string;
    username?: string; // if name refers to item owner, then this will be item owner's username, otherwise it will be undefined
    nameSource: PublisherSource;
    organization?: string;
    orgId?: string; // if organization refers to item owner's org, then this will be that org's orgId
    organizationSource: PublisherSource;
    isExternal: boolean; // whether the item is published to an external org (can only be set when no org info is available)
  };

  // TODO: should portalHomeUrl and portalApiUrl be hoisted to IHubItemEntity?
  // previously we had them in IHubResource
  /** URL of the resource's page in the Portal Home application */
  portalHomeUrl?: string;

  /** URL of the Portal API endpoint for the resource */
  portalApiUrl?: string;

  /** URL of the Portal API data endpoint for the resource */
  portalDataUrl?: string;

  // TODO: urls.relative or hubRelativeUrl

  /** Optional links to show in the Hub application for this content */
  actionLinks?: IActionLink[];

  /** Configure which Hub application actions (i.e. create web map) are available for this content */
  hubActions?: object;

  /** Information about the layer referenced by this content (geometryType, fields, etc) */
  layer?: Partial<ILayerDefinition>;

  /** Whether or not the layer or table is actually a proxied CSV */
  isProxied?: boolean;

  /** links to additional resources specified in the formal item metadata */
  additionalResources?: IHubAdditionalResource[];

  /** definition for content that refers to a client-side layer view */
  viewDefinition?: { definitionExpression?: string };

  // TODO: metrics, urls, publisher, etc?
}
