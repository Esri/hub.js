import type { IMigratableSchema } from "../../../migrations/types";
import type {
  IHistoryEntry,
  INodeOverrides,
  ITranslationMap,
  SectionOrRef,
} from "../../layout-shared-types";

/** Interface representing a V2 layout object. */
export interface ILayoutV2 extends IMigratableSchema {
  /** Schema version for the layout. */
  schemaVersion: 2;
  /** If true, the entire layout is read-only. */
  readOnly?: boolean;
  /** Array of sections in the layout. */
  sections: SectionOrRef[];
  /** Array of history entries for the layout. */
  history: IHistoryEntry[];
  /** Optional translations for the layout. */
  translations?: ITranslationMap;
  /** Optional overrides for layout nodes. */
  overrides?: INodeOverrides;
}
