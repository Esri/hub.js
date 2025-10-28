import type { ILayoutV1 } from "./migrations/types/ILayoutV1";
import type { ILayoutV2 } from "./migrations/types/ILayoutV2";

/** Union type of all layout schema versions.  */
export type Layout = ILayoutV1 | ILayoutV2;

/**
 * The latest supported layout schema. This should be
 * updated whenever a new schema version is released.
 */
export type ILayout = ILayoutV2;

/**
 * Type representing layout utility functions that are
 * passed down to all layout components.
 */
export type LayoutUtils = {
  processLayout: (layout: ILayout) => Promise<ILayout>;
};
