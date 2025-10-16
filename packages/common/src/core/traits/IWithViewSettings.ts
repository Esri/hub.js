import { HubEntityHero } from "../../enums/hubEntityHero";
import { HubActionLink } from "../types/ActionLinks";
import { IHubEmbed } from "../types/Embeds";
import { IHubMapSettings } from "../types/IHubMapSettings";
import { IHubTimeline } from "../types/IHubTimeline";
import { IMetricDisplayConfig } from "../types/Metrics";

/**
 * Properties to be exclusively displayed on an entity's
 * pre-defined view
 */
export interface IWithViewSettings {
  /**
   * array of contacts associated with an entity. Contact interface TBD
   */
  contacts?: any[];
  /**
   * array of entity's featured content ids to be rendered in a gallery
   */
  featuredContentIds?: string[];
  /**
   * entity's featured image url
   */
  featuredImageUrl?: string;
  /**
   * alt text of an entity's featured image
   */
  featuredImageAltText?: string;
  /**
   * name of an entity's featured image
   */
  featuredImageName?: string;
  /**
   * configuration settings for the entity map
   */
  mapSettings?: IHubMapSettings;
  /**
   * whether the entity should render it's location on a map
   */
  showMap?: boolean;
  /**
   * timeline associated with an entity
   */
  timeline?: IHubTimeline;

  /**
   * configurations for how to display metrics in the ui
   */
  metricDisplays?: IMetricDisplayConfig[];

  /**
   * what to show in the hero field, map/image
   */
  hero?: HubEntityHero;

  /**
   * array of actions for action links
   */
  heroActions?: HubActionLink[];

  /**
   * array of embedded content
   *
   * Note: for now, we are only allowing a single
   * embed to be configured, but we've made this
   * an array for future extensibility. If/when
   * we do support configuring multiple embeds,
   * we should revisit if/how this will map to a
   * future layout system
   */
  embeds?: IHubEmbed[];
}
