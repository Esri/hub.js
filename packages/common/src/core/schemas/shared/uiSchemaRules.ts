import { IUiSchemaRule } from "../types";

export const DISABLE_IF_EMPTY = (scope: string): IUiSchemaRule => {
  return {
    effect: "DISABLE",
    condition: {
      scope,
      schema: { const: "" },
    },
  };
};
