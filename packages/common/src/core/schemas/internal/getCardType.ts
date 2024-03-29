import { CardEditorType } from "../types";

/**
 * Helper function to get card type string from full type
 */
export function getCardType(type: CardEditorType): string {
  return type && type.split(":")[2];
}
