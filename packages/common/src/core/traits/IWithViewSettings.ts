import { HubEntityHero } from "../../types";
import { IHubTimeline, IMetricDisplayConfig } from "../types";

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
}
