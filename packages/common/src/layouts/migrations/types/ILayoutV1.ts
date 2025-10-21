import type { IMigratableSchema } from "../../../migrations/types";

/**
 * Interface representing a V1 layout object (e.g. the
 * original Ember layout system)
 *
 * TODO: flesh out v1 interface for migration purposes
 */
export interface ILayoutV1 extends IMigratableSchema {
  header?: unknown;
  sections?: unknown;
  footer?: unknown;
}
